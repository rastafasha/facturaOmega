import {ITipoPago} from '../classes/interface.tipopago';

export const TIPOS_PAGO: ITipoPago[] = [
  {
    id: 'IAV',
    nombre: 'IAVE',
    facturable: true
  },
  {
    id: 'TAG',
    nombre: 'TAG',
    facturable: true
  },
  {
    id: 'NOR',
    nombre: 'Normal',
    facturable: true
  },
  {
    id: 'CRE',
    nombre: 'Cuota Reducida',
    facturable: true
  },
  {
    id: 'DE',
    nombre: 'DE',
    facturable: false
  },
  {
    id: 'VSC',
    nombre: 'VSC',
    facturable: false
  },
  {
    id: 'RSP',
    nombre: 'RSP',
    facturable: false
  }
];


export const CARRILES: number[] = [1, 2, 3, 4];


export const SENALES: string[] = [
  'T01A',
  'T01M',
  'T02B',
  'T03B',
  'T04B',
  'T02C',
  'T03C',
  'T04C',
  'T05C',
  'T06C',
  'T07C',
  'T08C',
  'T09C',
  'L01A',
  'L02A',
  // Señales compuestas
  'T01L01A',
  'T01L02A'
];


export const FORMAS_PAGO = [
  {id: '01', nombre: 'Efectivo'},
  {id: '02', nombre: 'Cheque nominativo'},
  {id: '03', nombre: 'Transferencia electrónica de fondos'},
  {id: '04', nombre: 'Tarjeta de crédito'},
  {id: '05', nombre: 'Monedero electrónico'},
  {id: '06', nombre: 'Dinero electrónico'},
  {id: '08', nombre: 'Vales de despensa'},
  {id: '12', nombre: 'Dación en pago'},
  {id: '13', nombre: 'Pago por subrogación'},
  {id: '14', nombre: 'Pago por consignación'},
  {id: '15', nombre: 'Condonación'},
  {id: '17', nombre: 'Compensación'},
  {id: '23', nombre: 'Novación'},
  {id: '24', nombre: 'Confusión'},
  {id: '25', nombre: 'Remisión de deuda'},
  {id: '26', nombre: 'Prescripción o caducidad'},
  {id: '27', nombre: 'A satisfacción del acreedor'},
  {id: '28', nombre: 'Tarjeta de débito'},
  {id: '29', nombre: 'Tarjeta de servicios'},
  {id: '30', nombre: 'Aplicación de anticipos'},
  {id: '31', nombre: 'Intermediario pagos'},
  {id: '99', nombre: 'Por definir'}
];

export const USOS: any[] = [
  {id: 'G01', nombre: 'Adquisición de mercancías.	601, 603, 606, 612, 620, 621, 622, 623, 624, 625,626'},
  {id: 'G02', nombre: 'Devoluciones, descuentos o bonificaciones.	601, 603, 606, 612, 620, 621, 622, 623, 624, 625,626'},
  {id: 'G03', nombre: 'Gastos en general.	601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626'},
  {id: 'I01', nombre: 'Construcciones.	601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626'},
  {id: 'I02', nombre: 'Mobiliario y equipo de oficina por inversiones.	601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626'},
  {id: 'I03', nombre: 'Equipo de transporte.	601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626'},
  {id: 'I04', nombre: 'Equipo de computo y accesorios.	601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626'},
  {id: 'I05', nombre: 'Dados, troqueles, moldes, matrices y herramental.	601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626'},
  {id: 'I06', nombre: 'Comunicaciones telefónicas.	601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626'},
  {id: 'I07', nombre: 'Comunicaciones satelitales.	601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626'},
  {id: 'I08', nombre: 'Otra maquinaria y equipo.	601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626'},
  {id: 'D01', nombre: 'Honorarios médicos, dentales y gastos hospitalarios.	605, 606, 608, 611, 612, 614, 607, 615, 625'},
  {id: 'D02', nombre: 'Gastos médicos por incapacidad o discapacidad.	605, 606, 608, 611, 612, 614, 607, 615, 625'},
  {id: 'D03', nombre: 'Gastos funerales.	605, 606, 608, 611, 612, 614, 607, 615, 625'},
  {id: 'D04', nombre: 'Donativos.	605, 606, 608, 611, 612, 614, 607, 615, 625'},
  {id: 'D05', nombre: 'Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación).	605, 606, 608, 611, 612, 614, 607, 615, 625'},
  {id: 'D06', nombre: 'Aportaciones voluntarias al SAR.	605, 606, 608, 611, 612, 614, 607, 615, 625'},
  {id: 'D07', nombre: 'Primas por seguros de gastos médicos.	605, 606, 608, 611, 612, 614, 607, 615, 625'},
  {id: 'D08', nombre: 'Gastos de transportación escolar obligatoria.	605, 606, 608, 611, 612, 614, 607, 615, 625'},
  {id: 'D09', nombre: 'Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones.	605, 606, 608, 611, 612, 614, 607, 615, 625'},
  {id: 'D10', nombre: 'Pagos por servicios educativos (colegiaturas).	605, 606, 608, 611, 612, 614, 607, 615, 625'},
  {id: 'S01', nombre: 'Sin efectos fiscales.	601, 603, 605, 606, 608, 610, 611, 612, 614, 616, 620, 621, 622, 623, 624, 607, 615, 625, 626'},
  {id: 'S01', nombre: 'Pagos.	601, 603, 605, 606, 608, 610, 611, 612, 614, 616, 620, 621, 622, 623, 624, 607, 615, 625, 626'},
  {id: 'CN01', nombre: 'Nómina.	605'}
];

export const METODOS_PAGO: any[] = [
  {id: 'PUE', nombre: 'Pago en una sola exhibición'},
  {id: 'PPD', nombre: 'Pago en parcialidades o diferido'}
];

interface MotivoCancelacion {
  id: string;
  name: string;
}

export const MOTIVOS_DE_CANCELACION: MotivoCancelacion[] = [
  {id: '01', name: 'Comprobante emitido con errores con relación.'},
  {id: '02', name: 'Comprobante emitido con errores sin relación.'},
  {id: '03', name: 'No se llevó a cabo la operación.'},
  {id: '04', name: 'Operación nominativa relacionada en la factura global.'}
]

export const REGIMEN_FISCAL: any[] = [
  {id: '601', nombre: 'General de Ley Personas Morales'},
  {id: '603', nombre: 'Personas Morales con Fines no Lucrativos'},
  {id: '605', nombre: 'Sueldos y Salarios e Ingresos Asimilados a Salarios'},
  {id: '606', nombre: 'Arrendamiento'},
  {id: '608', nombre: 'Demás ingresos'},
  {id: '609', nombre: 'Consolidación'},
  {id: '610', nombre: 'Residentes en el Extranjero sin Establecimiento Permanente en México'},
  {id: '611', nombre: 'Ingresos por Dividendos (socios y accionistas)'},
  {id: '612', nombre: 'Personas Físicas con Actividades Empresariales y Profesionales'},
  {id: '614', nombre: 'Ingresos por intereses'},
  {id: '616', nombre: 'Sin obligaciones fiscales'},
  {id: '620', nombre: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos'},
  {id: '621', nombre: 'Incorporación Fiscal'},
  {id: '622', nombre: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras'},
  {id: '623', nombre: 'Opcional para Grupos de Sociedades'},
  {id: '624', nombre: 'Coordinados'},
  {id: '628', nombre: 'Hidrocarburos'},
  {id: '607', nombre: 'Régimen de Enajenación o Adquisición de Bienes'},
  {id: '629', nombre: 'De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales'},
  {id: '630', nombre: 'Enajenación de acciones en bolsa de valores'},
  {id: '615', nombre: 'Régimen de los ingresos por obtención de premios'},
  {id: '625', nombre: 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas'},
  {id: '626', nombre: 'Régimen Simplificado de Confianza'},
];
