/**
 * @author Hugo Gionori Soto Miguel
 * @version 1.0.0
 * @fileoverview Clase constructora de un objeto Tarifa
 */

import { Tarifa } from './tarifa';

/**
 * @class TarifaBuilder
 * @description Construye un objeto Tarifa usando Builder Pattern
 */
export class TarifaBuilder {

    /**
     * @property
     * @description Id de la tarifa
     * @type {string}
     */
     private id: string;

     /**
      * @property
      * @description Valor de la tarifa
      * @type {number}
      */
     private value: number;

    /**
     * @method setId
     * @description Establece el campo ID de la tarifa
     * @param id Id de la tarifa
     * @returns {TarifaBuilder}
     */
    public setId(id: string): TarifaBuilder {
       this.id = id
       return this;
    }

    /**
     * @method setValue
     * @description Establece el valor d la tarifa
     * @param value Valor de la tarifa
     * @returns {TarifaBuilder}
     */
    setValue(value: number): TarifaBuilder {
        this.value = value;
        return this;
    }    
   
    /**
     * @method build
     * @description Construye el objeto Tarifa
     * @returns {Tarifa}
     */
    build(): Tarifa {
        let tarifa: Tarifa = new Tarifa();
        tarifa.id = this.id;
        tarifa.value = this.value;
        return tarifa;
    }

}