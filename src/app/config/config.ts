import { environment } from "src/environments/environment";


export const URL_SERVICES: string = environment.url_services;

// La contraseña debe tener al entre 8 y 10 caracteres
// al menos un dígito
// al menos una minúscula y al menos una mayúscula
// NO puede tener otros símbolos
export const REG_EXP_PASSWORD = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,10}$/;

export const REG_EXP_RFC = '^[A-Z,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Z,0-9]?[A-Z,0-9]?[0-9,A-Z]?$';

export const SESSION_USUARIO_NAME: string = environment.user_session_name;

export const RUTA_ADMINISTRADOR: string = 'administrador';
export const RUTA_CAPTURISTA: string = 'capturista';
export const RUTA_CLIENTE: string = 'cliente';

export const PASSWORD_DEFAULT: string = 'Usuario123';

export const IVA: number = 0.16;

// Configuracion para la facturacion mensual
export const config_factura_mensual: any = {
    periodo_facturacion: {
        dia_inicial: 6,
        // dia_final: 15
    },
    meses_anteriores_permitidos: 12
};

// Configuracion para la facturacion mensual
export const config_factura_anual: any = {
    periodo_facturacion: {
       mes_inicial: 1,
       mes_final: 4
    }
};

// Congifuración para la facturación diaria
export const config_factura_diaria: any = {
    dias_anteriores_permitidos: 300
};

// Congifuración para la facturación semanal
export const config_factura_semanal: any = {
    semanas_anteriores_permitidas: 1
};

// Configuracion para columnas de los archivos en excel
export const TIPOS_IMPORTACION: any = [
    {
        id: 1,
        desc: 'Formato Normal y Cuota Reducida',
        config: {
            fila_inicial: 13,
            fecha: 0,
            hora: 1,
            carril: 2,
            senal: 6,
            tarifa: 8,
            pago: 10,
            folio: 11
        }
    },
    {
        id: 2,
        desc: 'IAVE y TAG',
        config: {
            fila_inicial: 13,
            fecha: 0,
            hora: 1,
            carril: 2,
            senal: 12,
            tarifa: null,
            pago: 13,
            folio: 15
        }
    }
];
