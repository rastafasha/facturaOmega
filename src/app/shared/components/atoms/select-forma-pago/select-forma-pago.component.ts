import {Component, EventEmitter, Output} from '@angular/core';

import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {FORMAS_PAGO} from 'src/app/data/catalogos';

@Component({
  selector: 'select-forma-pago',
  templateUrl: './select-forma-pago.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SelectFormaPagoComponent
    }
  ]
})
export class SelectFormaPagoComponent implements ControlValueAccessor {

  value: string = null;

  payment_forms: any[] = FORMAS_PAGO;

  onChange = (value: any) => {
  };

  onTouched = () => {
  };

  touched = false;

  disabled = false;

  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();


  selectHandle(event: any) {
    this.value = event.value;
    this.onChange(this.value);
    this.selectionChange.emit(event);
  }


  writeValue(value: string) {
    this.value = value;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

}
