/**
 * @author Hugo Gionori Soto Miguel
 * @version 2.0.0
 * @fileoverview Importa archivos XLS y CVS del sistema para subir a la base de datos
 *
 * History
 * v2.0.0 - Se integra configuracion para importacion para IAV y TAG
 * v1.0.0 - Formulario de importacion dinamico, se permite importar varios archivos simultaneamente
 */
import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Servicios
import { MessagesService } from '../../../services/messages.service';
import { BoletosService } from '../../../services/boletos.service';
import ISesion from '../../../classes/interface.sesion';
import { UsuariosService } from '../../../services/usuarios.service';
import { TarifasService } from '../../../services/tarifas.service';

// Clases
import { IImportacion } from '../../../classes/interface.importacion';
import { TicketUtils } from '../../../classes/ticket';
import { TIPOS_IMPORTACION } from '../../../config/config';
import { Tarifa } from '../../../classes/tarifa';
import { TipoImport, Conf } from 'src/app/models/tipoImportacion';
import { Boleto } from 'src/app/classes/class.boleto';

@Component({
  selector: 'app-importar-boletos-v3',
  templateUrl: './importar-boletos-v3.component.html',
  styles: [
  ]
})
/**
 * @class ImportarBoletosV3Component
 * @description Clase controladora de la importacion de boletos
 */
export class ImportarBoletosV3Component implements OnDestroy, OnInit {

  importados: IImportacion[] = [];
  loading: boolean;
  form: FormGroup;
  sesion: ISesion;
  tarifas: Tarifa[] = [];
  importConfigSelected: any = TIPOS_IMPORTACION;
  tipo:any = TIPOS_IMPORTACION;

  tipoimp;

  boletos: Boleto;

  tipoF:any = TipoImport;
  conf:any = Conf;

  columns: string[] = ['carril', 'fecha', 'folio', 'hora', 'pago', 'senal', 'tarifa'];
  dataPreview: any[] = [];

  @ViewChild(MatStepper) stepper: MatStepper;  // Setepper

  suscripcion: Subscription = new Subscription();

  readonly COLS: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  readonly TIPOS_IMPORTACION: any[] = TIPOS_IMPORTACION;

  /**
   * @constructor
   * @param {BoletosService} _boletosService Servicio de operaciones con boletos
   * @param {MessagesService} _messagesService Servicio de operaciones de mensajes UI
   * @param {UsuariosService} _usuariosService Servicio de operaciones con usuarios del sistema
   * @param {TarifasService} _tarifasService Servicio para consultar el catalofo de tarifas
   * @param {Router} router Enrutamiento de la pagina
   * @param {FormBuilder} fb Operaciones con formulario
   */
  constructor(private _boletosService: BoletosService,
              private _messagesService: MessagesService,
              private _usuariosService: UsuariosService,
              private _tarifasService: TarifasService,
              private router: Router,
              private fb: FormBuilder) {
    this.sesion = this._usuariosService.obtenerSesion();
    this.tipoimp = this._boletosService.tipoI;
    this.tipoimp = this._boletosService.tipoI;
  } // constructor


  /**
   * @method ngOnInit
   * @description Inicializacion del componente
   */
  ngOnInit(): void {
    this.form = this.fb.group({
      enabled: false,
      tipo_importacion: [null, Validators.required],
      // tipo_importacion: [TIPOS_IMPORTACION[0], Validators.required],
      filaInicial  : [null, [Validators.required, Validators.min(1)]],
      fecha        : [null,  Validators.required],
      hora         : [null,  Validators.required],
      carril       : [null,  Validators.required],
      senal        : [null,  Validators.required],
      tarifa       : [null,  Validators.required],
      pago         : [null, Validators.required],
      folio        : [null, Validators.required]
    });

    this.seleccionarConfiguracion(this.tipoF, this.conf);
    this.form.disable();
    this.loadTiposList();
    // console.log(this.boletos)
  } // ngOnInit

  /**
   * @method ngOnDestroy
   * @description Destruccion del componente
   */
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();

  } // ngOnDestroy

  //carga usos desde la app
  loadTiposList(): void{
    this.tipoF = this._boletosService.getTipos();
    console.log(this.tipoF);

    if(this.tipoF.id == '1'){
      return this.tipoF[0].desc;
    }if(this.tipoF.id == '2'){
      return this.tipoF[1].desc;
    }


  }


  /**
   * @method paso1
   * @description Configuracion de la importacion
   */
  paso1(): void {
    this.stepper.next();
  }


  /**
   * @method paso2
   * @param evt Evento recibido del input type file
   * @description Seleccion de los archivos a importar
   */
  async paso2(evt: any) {
    // Inicializamos valores
    const { id }: any = this.form.get('tipo_importacion').value;
    this.importados = [];
    this.loading = true;



    // Recorremos ls archivos seleccionados
    const target: DataTransfer = (evt.target) as DataTransfer;

    for (let i = 0; i < target.files.length; i++) {
      const config: any = {
        filaInicial: this.form.get('filaInicial').value,
        fecha: this.form.get('fecha').value,
        hora: this.form.get('hora').value,
        carril: this.form.get('carril').value,
        senal: this.form.get('senal').value,
        tarifa: this.form.get('tarifa').value,
        pago: this.form.get('pago').value,
        folio: this.form.get('folio').value
      };



      if (id === 2) {
        // IAVE y TAG
        await TicketUtils.importartXLS(target.files.item(i), config, this.tarifas)
          .then(imp => this.importados.push(imp))
          .catch(err => this._messagesService.error(err));
      } else {
        // NOR y CRE
        await TicketUtils.importartXLS(target.files.item(i), config)
          .then(imp => this.importados.push(imp))
          .catch(err => this._messagesService.error(err));
      }
    } // for i (recorrido de archivos)

    this.loading = false;
    this.stepper.next();
    console.log(this.importados);
  } // paso1


  /**
   * @method paso3
   * @description Importacion de los archivos
   */
  async paso3() {debugger
    this.loading = true;
    let error = false;

    for (let i = 0; i < this.importados.length; i++) {
      this.importados[i].message = 'Importando...';
      await this.importar(this.importados[i].data)
        .then(() => this._messagesService.toast(`${this.importados[i].file.name} importado correctamente`, 'OK'))
        .catch(err => {
          error = true;
          this.importados[i].err = this._messagesService.error(err, this.importados[i].file.name);
          this.importados[i].message = this.importados[i].err.messages;
        });
      this.importados[i].message = 'Importado';
    }

    if (error) {
      this.loading = false;
    } else {
      this.router.navigate([`/${this.sesion.path}/boletos`]);
    }
  } // paso2


  /**
   * @method importar
   * @description Importacion de la data
   * @param data Data a importar
   * @returns {Promise}
   */
  importar(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.suscripcion = this._boletosService.importar(data)
        .subscribe(() => resolve(), err => reject(err));
    });
  } // paso2


  /**
   * @method seleccionarConfiguracion
   * @description Selecciona el tipo de configuracion de importacion
   * @param tipoImportacion Tipo de importacion a establecer
   */
  seleccionarConfiguracion(tipoF: TipoImport, conf: Conf): void {
    const { config } = tipoF;

    this.importConfigSelected = tipoF;
    this.form.get('filaInicial').setValue(conf.fila_inicial);
    this.form.get('fecha').setValue(conf.fecha);
    this.form.get('hora').setValue(conf.hora);
    this.form.get('carril').setValue(conf.carril);
    this.form.get('senal').setValue(conf.senal);
    this.form.get('pago').setValue(conf.pago);
    this.form.get('folio').setValue(conf.folio);

    if (tipoF.id === 2) {
      this.form.get('tarifa').setValue(null);
      this.form.get('tarifa').disable();
      // Obtenemos catalogo de tarifas
      this.loading = true;
      this.suscripcion = this._tarifasService.cargarTodos()
      .subscribe(({ tarifas }) => {
        this.tarifas = tarifas;
        this.loading = false;
      }, err => {
        this.loading = false;
        this._messagesService.error(err);
      });
    } else {
      this.form.get('tarifa').setValue(conf.tarifa);
      this.form.get('tarifa').enable();
    }
  }


  previsualizar(data: any[]) {

  }

}
