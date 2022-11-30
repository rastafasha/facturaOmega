/**
 * @author Hugo Gionori Soto Miguel
 * @version 1.0.0
 * @fileoverview Clase de encapsulación de la información de un boleto
 */

/**
 * @class Ticket
 * @description Boleto en el sistema
 */
export class Ticket {

    /**
     * Fecha de emision del boleto
     * @type {Date}
     */
    private _fecha: Date;

    /**
     * Hora de emision del boleto
     * @type {string}
     */
    private _hora: string;

    /**
     * Carril en donde se cobro el boleto
     * @type {number}
     */
    private _carril: number;

    /**
     * Folio del boleto
     * @type {string}
     */
    private _folio: string;

    /**
     * Senal del vehiculo
     * @type {string}
     */
    private _senal: string;

    /**
     * Tipo de pago
     * @type {string}
     */
    private _pago: string;

    /**
     * Tarifa de cobro del boleto
     * @type {number}
     */
    private _tarifa: number;

    /**
     * ID de la factura expedida por Facturapi
     * @type {string}
     */
    private _id_facturapi: string;

    /**
     * ID del RFC al que se factura el boleto
     * @type {number}
     */
    private _rfcs_id: number

    /**
     * @constructor
     * @param {Date} _fecha Fecha de emisión del boleto
     * @param {string} _hora Hora de emisión del boleto
     * @param {number} _carril Carril en donde se cobró el boleto
     * @param {string} _folio Folio del boleto
     * @param {string} _senal Señal del vehículo
     * @param {string} _pago Tipo de pago
     * @param {number} _tarifa Tarifa del pago
     * @param {string} _id_facturapi ID de la factura Facturapi asignada a este boleto
     * @param {number} _rfcs_id RFC al que se facturó este boleto
     * @description Constructor de la clase
     */
    constructor(fecha?: Date,
                hora?: string,
                carril?: number,
                folio?: string,
                senal?: string,
                pago?: string,
                tarifa: number = 0,
                id_facturapi?: string,
                rfcs_id?: number) {
        this.fecha = fecha;
        this.hora = hora;
        this.carril = carril;
        this.folio = folio;
        this.senal = senal;
        this.pago = pago;
        this.tarifa = tarifa;
        this.id_facturapi = id_facturapi;
        this.rfcs_id = rfcs_id;
    }

   
    /**
     * @method fecha
     * @param {Date} fecha Fecha de emisión del boleto
     * @description Asignación de la fecha de emisión del boleto
     */
    set fecha(fecha: Date) {        
        this._fecha = fecha;
    }

    /**
     * @method hora
     * @param {string} hora Hora de emision del boleto
     * @description Asignación de la hora de emisión del boleto
     */
    set hora(hora: string) {
        this._hora = hora;
    }

    /**
     * @method carril
     * @param {number} carril Carril de uso del vehiculo
     * @description Asignación del carril usado
     */
    set carril(carril: number) {
        this._carril = Number(carril);
    }

    /**
     * @method folio
     * @param {string} folio Folio del boleto
     * @description Asignación del folio del boleto
     */
    set folio(folio: string) {
        this._folio = folio;
    }

    /**
     * @method senal
     * @param {string} senal Senal del veiculo
     * @description Asignación de la señal del vehículo
     */
    set senal(senal: string) {
        this._senal = senal;
    }

    /**
     * @method pago
     * @param {string} pago Tipo de pago del evento
     * @description Asignación del tipo de pago
     */
    set pago(pago: string) {
        this._pago = pago;
    }

    /**
     * @method id_facturapi
     * @param {string} id_facturapi ID de la factura en Facturapi
     * @description Asignación del ID de la factura Facturapi
     */
    set id_facturapi(id_facturapi: string) {
        this._id_facturapi = id_facturapi;
    }

    /**
     * @method rfcs_id
     * @param {number} rfcs_id ID del RFC de facturacion
     * @description Asignación del RFC al que se facturó el boleto
     */
    set rfcs_id(rfcs_id: number) {
        this._rfcs_id = rfcs_id ? Number(rfcs_id) : null;
    }

    /**
     * @method tarifa
     * @param {number} tarifa Tarifa de pago del evento
     * @description Asignación de la tarifa del pago
     */
    set tarifa(tarifa: number) {
        this._tarifa = Number(tarifa);
    }

    /**
     * @method fecha
     * @returns {Date}
     * @description Devuelve la fecha de emisión del boleto
     */
    get fecha(): Date {
        return this._fecha;
    }

    /**
     * @method hora
     * @description Devuelve la hora de emisión del boleto
     * @returns {string}
     */
    get hora(): string {
        return this._hora;
    }

    /**
     * @method carril
     * @description Devuelve el carril del evento
     * @returns {number}
     */
    get carril(): number {
        return this._carril;
    }

    /**
     * @method folio
     * @description Devuelve el folio del boleto
     * @returns {string}
     */
    get folio(): string {
        return this._folio;
    }

    /**
     * @method senal
     * @description Devuelve la senal del vehiculo
     * @returns {string}
     */
    get senal(): string {
        return this._senal;
    }

    /**
     * @method pago
     * @description Devuelve el tipo de pago del evento
     * @returns {string}
     */
    get pago(): string {
        return this._pago;
    }

    /**
     * @method tarifa
     * @description Devuelve la tarifa de pago
     * @returns {number}
     */
    get tarifa(): number {
        return this._tarifa;
    }

    /**
     * @method id_facturapi
     * @description Devuelve el ID de la factura en Facturapi
     * @returns {string}
     */
    get id_facturapi(): string {
        return this._id_facturapi;
    }

    /**
     * @method rfcs_id
     * @description Devuelve el ID del RFC de facturacion del boleto
     * @returns {number}
     */
    get rfcs_id(): number {
        return this._rfcs_id;
    }
   
    /**
     * @method toJSON
     * @description Convierte la clase a formato JSON
     * @override
     */
    toJSON(): any {
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