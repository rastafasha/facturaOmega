import {Address} from './class.address';
import {InternalPayment} from "./interface.facturapi";

export interface Comprador {
  legal_name: string;
  tax_id: string;
  tax_system: string;
  address: Address;
  email: string;
  phone?: string;
  id?: string;
}

export interface Producto {
  id?: string;
  description: string;
  product_key: string;
  price: number;
  unit_key: string;
  tax_included?: boolean;
}

export interface Articulo {
  quantity: number;
  discount?: number;
  product: Producto;
}


export interface Factura {
  id?: string;
  created_at?: Date;
  livemode?: boolean;
  status?: string;
  cancellation_status?: string;
  verification_url?: string;
  customer: Comprador;
  total?: number;
  uuid?: string;
  uso?: string;
  folio_number?: number;
  series?: string;
  payment_form?: string;
  payment_method?: string;
  related?: string[];
  currency?: string;
  exchange?: number;
  items: Articulo[];
  rfcs_id?: string;
}

export enum PaymentTaxType {
  IVA = 'IVA',
  ISR = 'ISR',
  IEPS = 'IEPS',
}

export enum PaymentTaxFactor {
  Tasa = 'Tasa',
  Cuota = 'Cuota',
  Exento = 'Exento',
}

export interface PaymentTax {
  base: number;
  type: PaymentTaxType;
  rate: number;
  factor: PaymentTaxFactor;
  withholding: boolean;
}

export interface PaymentData {
  amount: number;
  installment: number;
  last_balance: number;
  taxes: PaymentTax[];
  payments: InternalPayment[];
}
