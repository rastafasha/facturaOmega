import { Boleto } from './class.boleto';

export default interface IResponseBoleto {
    boletos: Boleto[];
    ok: boolean;
    pag_actual: number;
    pag_anterior: number;
    total_paginas: number;
    total_registros: number;
}