/**
 * @author Hugo Gionori Soto Miguel
 * @version 2.0.0
 *
 * history
 * v2.0.0 - Se agrego el metodo de pago
 * v1.0.0 - Facturacion completa
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import moment from 'moment';

// Servicios
import {BoletosService} from 'src/app/services/boletos.service';
import {PagesService} from 'src/app/services/pages.service';
import {MessagesService} from 'src/app/services/messages.service';
import {UsuariosService} from '../../../services/usuarios.service';
import {RfcsService} from '../../../services/rfcs.service';

// Utilidades
import {StandardErrorStateMatcher, peridoFacturacionValidator} from '../../../utils/cchsforms';

// Configuracion
import * as config from '../../../config/config';

// Data
import {TIPOS_PAGO, CARRILES, FORMAS_PAGO, METODOS_PAGO} from '../../../data/catalogos';

// Models
import {Boleto} from 'src/app/classes/class.boleto';
import {Factura, Articulo} from '../../../classes/interface.factura';
import {FacturasService} from '../../../services/facturas.service';
import ISesion from '../../../classes/interface.sesion';
import RFC from "../../../classes/class.rfc";
import { Usos} from 'src/app/models/usos.model';

@Component({
  selector: 'app-form-factura-general',
  templateUrl: './form-factura-general.component.html',
  styles: []
})
export class FormFacturaGeneralComponent implements OnDestroy, OnInit {

  columnas: string[] = ['cantidad', 'unidad', 'descripcion', 'importe', 'total'];
  dataSource: MatTableDataSource<Articulo> = new MatTableDataSource();
  loading: boolean;

  form: FormGroup;
  matcher = new StandardErrorStateMatcher();

  boletosServiceSuscripcion: Subscription = new Subscription();
  facturasServiceSuscripcion: Subscription = new Subscription();
  rfcsServiceSuscripcion: Subscription = new Subscription();

  totalFactura = 0;
  periodos: any[] = [];
  hoy = moment();
  rfcs: any[] = [];
  // usos: any[] = [];
  tiposPago: any[] = TIPOS_PAGO;
  carriles: number[] = CARRILES;
  formasPago: any[] = FORMAS_PAGO;
  metodosPago: any[] = METODOS_PAGO;

  factura: Factura;

  sesion: ISesion;
  configMensual = config.config_factura_mensual;
  configAnual = config.config_factura_anual;
  configDiaria = config.config_factura_diaria;
  configSemanal = config.config_factura_semanal;

  usos: Usos[] = [];
  // --------------------------------------------
  // Constructor
  // --------------------------------------------
  constructor(private _pagesService: PagesService,
              private _boletosService: BoletosService,
              private _messagesService: MessagesService,
              private _facturasService: FacturasService,
              private _usuariosService: UsuariosService,
              private _rfcsServices: RfcsService,
              private fb: FormBuilder,
              private router: Router) {
    moment.locale('es');
    this.sesion = this._usuariosService.obtenerSesion();
  }


  // --------------------------------------------
  // Inicializacion del componente
  // --------------------------------------------
  ngOnInit(): void {
    this.form = this.fb.group({
      'metodoPago': [null, Validators.required],
      'uso': [null, Validators.required],
      'formaPago': [null, Validators.required],
      'status': [3, Validators.required],
      'tipo': [null, peridoFacturacionValidator()],
      'periodo': [null, Validators.required],
      'tipoPago': [null, Validators.required],
      'carril': [null, Validators.required],
      'rfc_id': [null, Validators.required]
    });

    this.loading = true;
    // this.facturasServiceSuscripcion = this._facturasService
    //   .obtenerUsos()
    //   .subscribe(usos => {
    //     this.loading = false;
    //     this.usos = usos;
    //   }, err => {
    //     this.loading = false;
    //     this._messagesService.error(err);
    //   });

    this.loadUsosList();

    this.loading = true;
    // obtenemos catalogo de rfc's
    this.rfcsServiceSuscripcion = this._rfcsServices.cargarTodos().subscribe(res => {
      this.loading = false;
      this.rfcs = res.rfcs;
    }, err => {
      this.loading = false;
      this._messagesService.error(err);
    });
  } // ngOnInit


  // --------------------------------------------
  // Limpieza de memoria
  // --------------------------------------------
  ngOnDestroy(): void {
    this._pagesService.openedFiltro.emit([]);
    this.boletosServiceSuscripcion.unsubscribe();
    this.facturasServiceSuscripcion.unsubscribe();
    this.rfcsServiceSuscripcion.unsubscribe();
  }

  //carga usos desde la app
  loadUsosList(): void{
    this.usos = this._facturasService.getUsos_list()
    console.log(this.usos);

  }


  // --------------------------------------------
  // Solicita los boletos al backend
  // --------------------------------------------
  prefacturar() {
    this.loading = true;

    const filtros: any = {
      fecha_inicial: this.periodos[this.form.get('periodo').value].fecha_inicial,
      fecha_final: this.periodos[this.form.get('periodo').value].fecha_final,
      status: this.form.get('status').value
    };

    this.boletosServiceSuscripcion = this._boletosService
      .cargarTodos(filtros)
      .subscribe(({boletos}) => {
        this.construirFactura(boletos);
        this.dataSource.data = this.factura.items;
        this.loading = false;
        this.totalFactura = 0;
        this.factura.items.forEach(item => this.totalFactura += item.quantity * item.product.price);

      }, err => {
        this.loading = false;
        this._messagesService.error(err);
      });
  } // prefacturar


  // ---------------------------------------------------------
  // Construye el la factura en formato Facturapi para timbrar
  // ---------------------------------------------------------
  construirFactura(boletos: Boleto[]): void {
    // Iniciamos la factura
    const rfc: RFC = this.rfcs[this.form.get('rfc_id').value];
    this.factura = {
      customer: {
        legal_name: rfc.razon_social || `${rfc.nombres} ${rfc.apellidos}`,
        email: rfc.email,
        tax_id: rfc.clave,
        tax_system: rfc.tax_system,
        address: rfc.address
      },
      items: [],
      uso: this.form.get('uso').value,
      payment_form: this.form.get('formaPago').value,
      payment_method: this.form.get('metodoPago').value
    };

    // Seleccionamos boletos que se puedan facturar
    const tiposPagoFiltro: string[] = this.form.get('tipoPago').value;
    const carrilesFiltro: number[] = this.form.get('carril').value;
    // Recojemos senales sin repetirse
    let senales: Set<string> = new Set();
    // Iniciamos recorrido
    boletos = boletos.filter(boleto => {
      senales.add(boleto.senal);
      return tiposPagoFiltro.includes(boleto.pago) && carrilesFiltro.includes(boleto.carril);
    });

    // agrupamos por señales
    senales.forEach(senal => {
      // De este grupo separamos las tarifas CRE y NOR
      let tarifas: Set<number> = new Set();
      let max: number = 0;
      let min: number = 1000000;

      const grupo: Boleto[] = boletos.filter(boleto => {
        const perteneceGrupo: boolean = boleto.senal === senal;

        if (perteneceGrupo) {
          tarifas.add(boleto.tarifa);
          max = Math.max(max, boleto.tarifa);
          min = Math.min(min, boleto.tarifa);
        }

        return perteneceGrupo;
      });

      // Recorremos las tarifas del grupo
      tarifas.forEach(tarifa => {
        const subgrupo: Boleto[] = grupo.filter(boleto => boleto.tarifa == tarifa);

        // Determinamos si es CRE o NOR
        let subtext: string = '';
        if (tarifas.size > 1) {
          // si hay mas de una tarifa clasificar
          let cuota: string = 'Desconocida';
          switch (tarifa) {
            case min:
              cuota = 'Reducida';
              break;
            case max:
              cuota = 'Normal';
              break;
          }
          subtext = `Cuota ${cuota}`;
        }

        const periodo: any = this.periodos[this.form.get('periodo').value];

        //Inicializamos item
        let articulo: Articulo = {
          product: {
            description: `CRUCES DE PEAJE LIBRAMIENTO TECPAN Tarifa ${senal} ${subtext} periodo ${periodo.desc}.`,
            price: tarifa,
            unit_key: 'C62',
            product_key: '95111603',
            tax_included: true
          },
          quantity: subgrupo.length,
        }

        if (articulo.quantity > 0 && articulo.product.price > 0) {
          this.factura.items.push(articulo);
        }
      }); // tarifas
    }); // señales
  } // construirFactura


  // --------------------------------------------
  // Timbrar factura
  // --------------------------------------------
  facturar(): void {
    const mensaje: string = `Se incluirán en la factura boletos que ya han sido
                            timbrados con anterioridad en este periodo pero no
                            se timbrarán con esta nueva factura`;

    this._messagesService.confirm(
      mensaje,
      () => {
        this.loading = true;

        const filtros: any = {
          rfc_id: this.rfcs[this.form.get('rfc_id').value].id,
          periodo: this.periodos[this.form.get('periodo').value],
          carril: this.form.get('carril').value,
          pago: this.form.get('tipoPago').value
        };

        this._facturasService.facturarGlobal(this.factura, filtros)
          .subscribe(() => {
            this.router.navigate([`/${this.sesion.path}/facturas`]);
          }, err => {
            this.loading = false;
            this._messagesService.error(err);
          });
      }, '¿Desea timbrar esta factura?'
    );
  } // facturar


  // --------------------------------------------------
  // Selecciona el tipo de facturacion
  // --------------------------------------------------
  seleccionarTipoFactura(tipo: string) {
    this.periodos = [];
    const inicio = moment();

    if (tipo === 'mensual') {
      // Si la factura es mensual
      inicio.subtract(this.configMensual.meses_anteriores_permitidos, 'month');

      while (inicio.isBefore(this.hoy)) {
        this.periodos.push({
          fecha_inicial: inicio.startOf('month').startOf('day').toDate(),
          fecha_final: inicio.endOf('month').startOf('day').toDate(),
          desc: `${moment.months()[inicio.month()]}/${inicio.year()}`
        });

        inicio.add(1, 'month');
      }

    } else if (tipo === 'anual') {
      // Si la facturacion es anual
      inicio.subtract(1, 'year');
      this.periodos.push({
        fecha_inicial: inicio.startOf('year').startOf('day').toDate(),
        fecha_final: inicio.endOf('year').startOf('day').toDate(),
        desc: `${inicio.year()}`
      });

    } else if (tipo === 'diaria') {
      // Si la factura es diaria
      for (let i = this.configDiaria.dias_anteriores_permitidos; i; i--) {
        inicio.subtract(1, 'day').startOf('day');

        this.periodos.push({
          fecha_inicial: inicio.toDate(),
          fecha_final: inicio.toDate(),
          desc: inicio.format('DD/MMMM/YYYY')
        });
      }

    } else {
      // Si la factura es semanal
      for (let i = this.configSemanal.semanas_anteriores_permitidas; i; i--) {
        const fechaInicial = inicio.subtract(1, 'week').startOf('week').startOf('day');
        const fechaFinal = fechaInicial.clone().endOf('week').startOf('day');

        this.periodos.push({
          fecha_inicial: fechaInicial.toDate(),
          fecha_final: fechaFinal.toDate(),
          desc: `Del ${fechaInicial.format('DD/MMMM/YYYY')} al ${fechaFinal.format('DD/MMMM/YYYY')}`
        });
      }

    }
  } // seleccionarTipofactura

}
