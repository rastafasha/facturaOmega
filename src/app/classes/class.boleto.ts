
import { TIPOS_PAGO, SENALES } from '../data/catalogos';
import { ITipoPago } from './interface.tipopago';

export class Boleto {

    constructor(private _fecha?: Date,
                private _hora?: string,
                private _carril?: number,
                private _folio?: string,
                private _senal?: string,
                private _pago?: string,
                private _tarifa: number = 0,
                private _id_facturapi?: string,
                private _rfcs_id?: number) {}
   
    set fecha(fecha: Date) {        
        this._fecha = fecha;
    }

    set hora(hora: string) {
        this._hora = hora;
    }

    set carril(carril: number) {
        this._carril = Number(carril);
    }

    set folio(folio: string) {
        this._folio = folio;
    }

    set senal(senal: string) {
        this._senal = senal;
    }

    set pago(pago: string) {
        this._pago = pago;
    }

    set id_facturapi(id_facturapi: string) {
        this._id_facturapi = id_facturapi;
    }

    set rfcs_id(rfcs_id: number) {
        this._rfcs_id = rfcs_id ? Number(rfcs_id) : null;
    }

    set tarifa(tarifa: number) {
        this._tarifa = Number(tarifa);
    }

    get fecha(): Date {
        return this._fecha;
    }

    get hora(): string {
        return this._hora;
    }

    get carril(): number {
        return this._carril;
    }

    get folio(): string {
        return this._folio;
    }

    get senal(): string {
        return this._senal;
    }

    get pago(): string {
        return this._pago;
    }

    get tarifa(): number {
        return this._tarifa;
    }

    get id_facturapi(): string {
        return this._id_facturapi;
    }

    get rfcs_id(): number {
        return this._rfcs_id;
    }

    get facturable(): boolean {
        const tipoPago: ITipoPago = TIPOS_PAGO.find(tp => tp.id === this.pago);
        return !!tipoPago && tipoPago.facturable && this.folio !== '0' && this.folio !== '';
    }

    get ocupado(): boolean {
        return this.id_facturapi || this.rfcs_id ? true : false;
    }



    split(): Boleto[] {
        let boletos: Boleto[] = [];

        const senal: string = SENALES.find(t => t === this.senal);

        if (!senal) {
            // Si es una señal compuesta, separamos boletos

            // Obtenemos el indice del boleto complementario
            const index: number = Math.max(this.senal.indexOf('L01A'), this.senal.indexOf('L02A'));
            if (index < 0) {
                // Si no se encontro agregamos unico boleto
                boletos.push(this);
            } else {
                // Si se encontro boleto complementario, separamos
                let boletoComplementario: Boleto = new Boleto();                
                boletoComplementario.fromJson(this.toJson());
                boletoComplementario.senal = boletoComplementario.senal.substring(index, boletoComplementario.senal.length);
                
                let boletoPrincipal: Boleto = new Boleto();
                boletoPrincipal.fromJson(this.toJson());
                boletoPrincipal.senal = boletoPrincipal.senal.substring(0, index);
                boletoPrincipal.senal += boletoComplementario.senal.charAt(boletoComplementario.senal.length - 1);

                boletos.push(boletoPrincipal, boletoComplementario);
            }


        } else {
            // Si es una señal simple, lo agregamos unicamente a él en el arreglo
            boletos.push(this);
        }        

        return boletos;
    }
    
    fromJson(boleto: any): Boleto {
        this.fecha = boleto.fecha;
        this.hora = boleto.hora;
        this.carril = boleto.carril;
        this.folio = boleto.folio;
        this.senal = boleto.senal;
        this.pago = boleto.pago;
        this.tarifa = boleto.tarifa;
        this.id_facturapi = boleto.id_facturapi;
        this.rfcs_id = boleto.rfcs_id;
        return this;
    }
    
    toJson(): any {
        return {
            fecha:   this.fecha,
            hora:    this.hora,
            carril:  this.carril,
            folio:   this.folio,
            senal:   this.senal,
            pago:    this.pago,
            tarifa:  this.tarifa,
            rfcs_id:  this.rfcs_id,
            id_facturapi: this.id_facturapi
        };
    }

}