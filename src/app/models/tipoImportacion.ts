export class TipoImport{
  id: number;
  desc: string;
  config:Conf;
}

export class Conf{
  fila_inicial: number;
  fecha: number;
  hora: number;
  carril: number;
  senal: number;
  tarifa: number;
  pago: number;
  folio: number;
}

