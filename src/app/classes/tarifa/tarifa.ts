/**
 * @author Hugo Gionori Soto Miguel
 * @version 1.0.0
 * @fileoverview Encapsulacion de una tarifa
 */

/**
 * @class Tarifa
 * @description Encapsula la informacion de una tarifa
 */
export class Tarifa {

    /**
     * @type {string}
     * @description Identificador de la tarifa
     */
    private _id: string;

    /**
     * @type {number}
     * @description Valor de la tarifa
     */
     private _value: number;

    /**
     * @constructor
     */
    constructor() {
        this.id = null;
        this.value = null;
    }

    /**
     * @mehod id
     * @param {string} id Id de la tarifa
     */
    set id(id: string) {
        this._id = id;
    }

    /**
     * @mehod value
     * @param {number} value Valor de la tarifa
     */
    set value(value: number) {
        this._value = Number(value);
    }

    /**
     * @method id
     * @description Retorna el ID de la tarifa
     * @return {string}
     */
    get id(): string {
        return this._id;
    }

    /**
     * @method value
     * @description Retorna el valor de la tarifa
     * @return {string}
     */
     get value(): number {
        return this._value;
    }

    /**
     * @mehod toJSON
     * @override
     * @description Devuelve una tarifa en formato JSON
     * @return {any} 
     */
    toJSON(): any {
        return {
            id: this.id,
            value: this.value
        };
    }


    /**
     * @method fromJSON
     * @description Carga una Tarifa por medio de un objeto any
     * @param {any} tarifa Tarifa en formato objeto literal 
     * @return {Tarifa}
     */
    fromJSON(tarifa: any): Tarifa {
        this.id = tarifa.id;
        this.value = tarifa.value;
        return this;
    }

}