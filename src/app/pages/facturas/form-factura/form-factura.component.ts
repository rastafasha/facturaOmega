import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import moment from 'moment';
// import * as moment from 'moment';

// Utilerias
import {StandardErrorStateMatcher} from '../../../utils/cchsforms';

// Servicios
import {FacturasService} from '../../../services/facturas.service';
import {MessagesService} from '../../../services/messages.service';
import {UsuariosService} from '../../../services/usuarios.service';
import {PagesService} from '../../../services/pages.service';
import {BoletosService} from '../../../services/boletos.service';

// Clases
import RFC from '../../../classes/class.rfc';
import {Boleto} from '../../../classes/class.boleto';
import ISesion from '../../../classes/interface.sesion';
import {Factura, Articulo, Producto} from '../../../classes/interface.factura';

@Component({
  selector: 'app-form-factura',
  templateUrl: './form-factura.component.html',
  styles: []
})
export class FormFacturaComponent implements OnInit, OnDestroy {

  form: FormGroup;
  formGeneral: FormGroup;
  loading: boolean;
  matcher = new StandardErrorStateMatcher();
  columnas: string[] = ['fecha', 'hora', 'carril', 'senal', 'tarifa', 'pago', 'folio', 'acciones'];

  boletos: Boleto[] = [];
  usos: any[] = [];

  mask = [/\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/];
  dateFilter: any;

  facturasServiceSubscripcion: Subscription = new Subscription();
  sessionUpdatedSubscription: Subscription = new Subscription();

  sesion: ISesion;

  // -------------------------------------------------------
  // Constructor de la clase
  // -------------------------------------------------------
  constructor(private _facturasService: FacturasService,
              private _usuariosService: UsuariosService,
              private _messagesService: MessagesService,
              private _pagesService: PagesService,
              private _boletosService: BoletosService,
              private formBuilder: FormBuilder,
              private router: Router) {
    moment.locale('es');

    // Filtro de datepicker
    this.dateFilter = (d: Date | null): boolean => {
      const hoy = moment(); // Fecha de hoy
      const fecha = moment(d); // Fecha del datepicker
      const inicio = moment().subtract(1, 'month').endOf('month'); // Inicio del periodo
      const fin = moment().endOf('month'); // Fin del periodo

      if (hoy.date() >= 1 && hoy.date() <= 5) {
        // Si estamos en dias de prorroga habilitamos todo el mes anterior
        inicio.subtract(1, 'month').endOf('month');
      }

      return fecha.isBetween(inicio, fin);
    };
    // Fin del filtro de datepicker

  } // constructor


  // -------------------------------------------------------------------
  // Inicializacion del documento
  // -------------------------------------------------------------------
  ngOnInit(): void {
    // Construccion del formulario
    this.formGeneral = this.formBuilder.group({
      'uso': [null, Validators.required]
    });

    this.form = this.formBuilder.group({
      'fecha': [null, Validators.required],
      'hora': ['00:00:00', [Validators.required, Validators.minLength(8)]],
      'carril': [null, [Validators.required]],
      'folio': [null, [Validators.required]]
    });

    this.loading = true;

    this.sessionUpdatedSubscription = this._usuariosService.sessionUpdated.subscribe((session: any) => {
      this.sesion = session;
    });

    this.facturasServiceSubscripcion = this._facturasService
      .obtenerUsos()
      .subscribe(usos => {
        this.loading = false;
        this.usos = usos;
      }, err => {
        this.loading = false;
        this._messagesService.error(err);
      });

    //Escuchamos cambios en el header
    this._pagesService.selectedRFC
      .subscribe((rfc: RFC) => this.sesion.rfc = rfc);

    this.sesion = this._usuariosService.obtenerSesion();

    if (!this.sesion.rfc) {
      this._messagesService.error('Debe agregar y seleccionar un RFC para comenzar a facturar');
    }
  } // ngOnInit


  // -------------------------------------------------------------------
  // Limpieza de memoria
  // -------------------------------------------------------------------
  ngOnDestroy(): void {
    this.facturasServiceSubscripcion.unsubscribe();
    this.sessionUpdatedSubscription.unsubscribe();
  }


  // -------------------------------------------------------------------
  // Agrega un boleto a la linea de facturacion
  // -------------------------------------------------------------------
  agregarBoleto(boleto: Boleto): void {
    if (boleto.ocupado) {
      this._messagesService.info('Este boleto ya ha sido timbrado', 'Boleto ocupado');
      return;
    }

    if (!boleto.facturable) {
      this._messagesService.info('Solo boletos con pagos normal o cuota reducida pueden ser facturados');
      return;
    }

    const encontrado: number = this.boletos.findIndex(ticket => {
      return ticket.fecha === boleto.fecha &&
        ticket.folio === boleto.folio &&
        ticket.hora === boleto.hora &&
        ticket.carril === boleto.carril;
    });

    if (encontrado < 0) {
      boleto.rfcs_id = this.sesion.rfc.id;
      this.boletos.push(boleto);
      this.boletos = [...this.boletos];
    }
  } // agregarBoleto


  // -------------------------------------------------------------------
  // Busca un boleto en el sistema
  // -------------------------------------------------------------------
  buscar(): void {
    const fecha: Date = this.form.get('fecha').value;
    const hora: string = this.form.get('hora').value;
    const carril: number = this.form.get('carril').value;
    const folio: string = this.form.get('folio').value;

    this.loading = true;
    this.facturasServiceSubscripcion = this._boletosService
      .obtenerBoleto(fecha, hora, carril, folio)
      .subscribe((boleto: Boleto) => {
        this.agregarBoleto(boleto);
        this.loading = false;

      }, err => {
        this.loading = false;
        this._messagesService.error(err);
      });
  } // buscar


  // -------------------------------------------------------
  // Genera la factura electrónica
  // -------------------------------------------------------
  facturar() {
    this._messagesService.confirm(
      '¿Desea continuar con la facturación?',
      () => {
        // recorremos los boletos para crear los items
        let items: Articulo[] = [];
        this.boletos.forEach(boleto => {
          // Producto
          let producto: Producto = {
            description: `CUOTA DE PEAJE LIBRAMIENTO DE TECPAN, CARRIL ${boleto.carril} A LAS ${boleto.hora} HRS. DEL ${boleto.fecha}, BOLETO NO. FOLIO ${boleto.folio}.`,
            product_key: '95111603',
            price: boleto.tarifa,
            unit_key: 'C62',
            tax_included: true
          };
          // Artiulo
          let articulo: Articulo = {
            product: producto,
            quantity: 1
          };
          // Items
          items.push(articulo);
        });
        // Fin del recorrido de los boletos

        let factura: Factura = {
          customer: {
            legal_name: this.sesion.rfc.tipo == RFC.PERSONA_FISICA ? this.sesion.rfc.nombreCompleto : this.sesion.rfc.razon_social,
            tax_id: this.sesion.rfc.clave,
            tax_system: this.sesion.rfc.tax_system,
            email: this.sesion.rfc.email,
            address: this.sesion.rfc.address
            //phone: this.sesion.rfc.telefono
          },
          items: items,
          uso: this.formGeneral.get('uso').value
        };

        this.loading = true;
        this.facturasServiceSubscripcion = this._facturasService
          .facturar(factura, this.boletos)
          .subscribe(() => {
            this.loading = false;
            this._messagesService.toast('Factura generada satisfactoriamente', 'OK');
            this.router.navigate([`/${this.sesion.path}/facturas`]);
          }, err => {
            this.loading = false;
            this._messagesService.error(err);
          });
      },
      'Una vez generada la factura podrá cancelarla en nuestras oficinas si así lo requiere.'
    );
  } // facturar


  // -------------------------------------------------------
  // Quita un boleto de la facturacion
  // -------------------------------------------------------
  quitarBoleto(index: number): void {
    this._messagesService.confirm('¿Desea quitar este boleto?', () => {
      this.boletos.splice(index, 1);
      this.boletos = [...this.boletos];
    });
  } // quitarBoleto

}
