/**
 * @author Hugo Gionori Soto Miguel
 * @version 1.0.0
 * @fileoverview Clase constructora de un objeto Ticket
 */

import { Ticket } from './ticket';

/**
 * @class TicketBuilder
 * @description Construye un objeto Ticket usando Builder Pattern
 */
export class TicketBuilder {

    /**
     * Fecha de emision del boleto
     * @type {Date}
     */
     private fecha: Date;

     /**
      * Hora de emision del boleto
      * @type {string}
      */
     private hora: string;
 
     /**
      * Carril en donde se cobro el boleto
      * @type {number}
      */
     private carril: number;
 
     /**
      * Folio del boleto
      * @type {string}
      */
     private folio: string;
 
     /**
      * Senal del vehiculo
      * @type {string}
      */
     private senal: string;
 
     /**
      * Tipo de pago
      * @type {string}
      */
     private pago: string;
 
     /**
      * Tarifa de cobro del boleto
      * @type {number}
      */
     private tarifa: number;
 
     /**
      * ID de la factura expedida por Facturapi
      * @type {string}
      */
     private id_facturapi: string;
 
     /**
      * ID del RFC al que se factura el boleto
      * @type {number}
      */
     private rfcs_id: number  

    /**
     * @method setId
     * @description Establece el campo ID compuesto del boleto
     * @param fecha Fecha de emision del boleto
     * @param hora Hora de de emision del boleto
     * @param carril Carril donde se emitio el boleto
     * @returns {TicketBuilder}
     */
    public setId(fecha: Date, hora: string, carril: number): TicketBuilder {
        this.fecha = fecha;
        this.hora = hora;
        this.carril = carril;
        return this;
    }

    /**
     * @method setFolio
     * @description Establece el folio del boleto
     * @param folio Folio del boleto
     * @returns {TicketBuilder}
     */
    setFolio(folio: string): TicketBuilder {
        this.folio = folio;
        return this;
    }

    /**
     * @method setSenal
     * @description Establece la senal del automovil
     * @param senal Senal del automovil
     * @returns {TicketBuilder}
     */
    setSenal(senal: string): TicketBuilder {
        this.senal = senal;
        return this;
    }

    /**
     * @method setPago
     * @description Establece el tipo de pago del evento
     * @param pago Tipo de pago del evento
     * @returns {TicketBuilder}
     */
    setPago(pago: string):TicketBuilder {
        this.pago = pago;
        return this;
    }

    /**
     * @method setId_facturapi
     * @description Establece el ID de la factura Facturapi
     * @param id_facturapi ID de la factura Facturapi
     * @returns {TicketBuilder}
     */
    setId_facturapi(id_facturapi: string): TicketBuilder {
        this.id_facturapi = id_facturapi;
        return this;
    }

    /**
     * @method setRfcs_id
     * @description Establece le ID el RFC a facturar para el boleto
     * @param rfcs_id ID del RFC a facturar del boleto
     * @returns {TicketBuilder}
     */
    setRfcs_id(rfcs_id: number): TicketBuilder {
        this.rfcs_id = rfcs_id;
        return this;
    }

    /**
     * @method setTarifa
     * @description Establece la tarifa o monto del boleto
     * @param tarifa Tarifa o monto del boleto
     * @returns {TicketBuilder}
     */
    setTarifa(tarifa: number): TicketBuilder {
        this.tarifa = tarifa;
        return this;
    }
   
    /**
     * @method build
     * @description Construye el objeto Ticket
     * @returns {Ticket}
     */
    build(): Ticket {
        return new Ticket(
            this.fecha,
            this.hora,
            this.carril,
            this.folio,
            this.senal,
            this.pago,
            this.tarifa,
            this.id_facturapi,
            this.rfcs_id
        );
    }

}