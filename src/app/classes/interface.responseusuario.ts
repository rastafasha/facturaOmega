import Usuario from './class.usuario';


export default interface IResponseUsuario {
    usuarios: Usuario[];
    ok: boolean;
    pag_actual: number;
    pag_anterior: number;
    total_paginas: number;
    total_registros: number;
}