import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import RFC from '../../../../classes/class.rfc';
import {RfcsService} from '../../../../services/rfcs.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StandardErrorStateMatcher} from '../../../../utils/cchsforms';
import {FacturasService} from '../../../../services/facturas.service';
import {Comprador, PaymentData, PaymentTaxFactor, PaymentTaxType} from '../../../../classes/interface.factura';
import {MessagesService} from '../../../../services/messages.service';
import {RoutingService} from "../../../../services/routing.service";

interface Payment {
  invoice: any;
  data: PaymentData;
}

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styles: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {
  rfcs: RFC[];
  rfcReceptor: RFC;
  searchForm: FormGroup;
  invoiceForm: FormGroup;
  errorMatcher: StandardErrorStateMatcher;
  invoices: Payment[] = [];
  customer: Comprador;
  customerRfcId: string;
  loading: boolean;
  invoiceTotal: number;
  maxDate: Date;

  constructor(
    private facturasService: FacturasService,
    private rfcsService: RfcsService,
    private formBuilder: FormBuilder,
    private messagesService: MessagesService,
    private routingService: RoutingService
  ) {
    this.maxDate = new Date();
    this.errorMatcher = new StandardErrorStateMatcher();
    this.searchForm = formBuilder.group({
      series: [null, [Validators.required]],
      folio: [null, [Validators.required]]
    });
    this.invoiceForm = formBuilder.group({
      payment_form: [null, [Validators.required]],
      date: [new Date(), [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadRfcs();
    this.updateComplementData();
  }

  public loadRfcs(): void {
    this.rfcsService.cargarTodos().subscribe(res => {
      this.rfcs = res.rfcs;
    });
  }

  updateComplementData(): void {
    if (this.invoices.length) {
      const invoiceData = this.invoices[0];
      this.customer = invoiceData.invoice.customer;
    } else {
      this.customer = null;
    }
    this.updateInvoiceTotal();
  }

  updateInvoiceTotal(): void {
    this.invoiceTotal = 0;
    this.invoices.forEach(inv => this.invoiceTotal += Number(inv.data.amount));
  }

  removeInvoice(invoiceId: string): void {
    this.invoices = this.invoices.filter(inv => inv.invoice.id !== invoiceId);
    this.updateComplementData();
  }

  clearSearchForm(): void {
    this.searchForm.reset();
  }

  async generatePayment(): Promise<void> {
    this.loading = true;
    const payment = {
      type: 'P',
      customer: this.customer.id,
      complements: [{
        type: 'pago',
        data: [{
          payment_form: this.invoiceForm.get('payment_form').value,
          related_documents: this.getComplementData()
        }]
      }]
    };

    try {
      const res = await this.facturasService.facturarPago(payment, this.customerRfcId).toPromise();
      console.log(res);
      this.messagesService.toast('Factura creada correctamente');
      this.routingService.GoTo('facturas');
    } catch ({error}) {
      console.log(error);
      this.messagesService.error(error.errors.message);
    }
    this.loading = false;
  }

  private getComplementData(): any {
    return this.invoices.map(inv => {
      return {
        uuid: inv.invoice.uuid,
        amount: inv.data.amount,
        taxes: inv.data.taxes,
        installment: inv.data.installment,
        last_balance: inv.data.last_balance,
      };
    });
  }

  async addInvoice(): Promise<any> {
    try {
      const series = this.searchForm.get('series').value;
      const folioNumber = this.searchForm.get('folio').value;
      this.loading = true;

      const internalInvoice = await this.facturasService.cargarPorFolio(series, folioNumber).toPromise();
      const apiInvoice = await this.facturasService.cargar(internalInvoice.id).toPromise();

      this.customerRfcId = internalInvoice.rfcs_id;
      console.log(apiInvoice);

      if (apiInvoice.message) {
        return this.messagesService.error(apiInvoice.message);
      }

      if (apiInvoice.status !== 'valid') {
        return this.messagesService.error('No puede agregar una factura cancelada');
      }

      if (apiInvoice.payment_form !== '99' && apiInvoice.payment_method !== 'PPD') {
        return this.messagesService.error('Solo se agregan complementos a facturas con método de pago Pago Por Diferir, y con forma de pago Por Definir.');
      }

      if (this.invoices.length && this.invoices[0].invoice.customer.tax_id !== apiInvoice.customer.tax_id) {
        return this.messagesService.error('Solo puede agregar facturas dirigidas al mismo RFC de un cliente.');
      }

      if (this.invoices.find(inv => inv.invoice.id === apiInvoice.id)) {
        return this.messagesService.error('Solo puede agregar 1 véz cada CFDI');
      }

      const pagos = await this.facturasService.obtenerPagos(apiInvoice.uuid).toPromise();

      let lastBalance = 0;
      pagos.forEach(pago => lastBalance += Number(pago.amount));

      this.invoices.push({
          invoice: apiInvoice,
          data: {
            taxes: [],
            amount: null,
            installment: pagos.length + 1,
            last_balance: apiInvoice.total - lastBalance,
            payments: pagos
          }
        }
      );

      this.updateComplementData();
      this.clearSearchForm();

      console.log(pagos);

    } catch (e) {
      this.messagesService.error(e.message);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Taxes
   */
  public addTax(payment: Payment): void {
    payment.data.taxes.push({
      type: PaymentTaxType.IVA,
      rate: 16,
      base: null,
      withholding: false,
      factor: PaymentTaxFactor.Tasa
    });
  }

  public removeTax(payment: Payment, slot: number): void {
    payment.data.taxes.splice(slot, 1);
  }
}
