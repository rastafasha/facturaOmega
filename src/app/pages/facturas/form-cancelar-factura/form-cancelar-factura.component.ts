import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StandardErrorStateMatcher} from '../../../utils/cchsforms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MOTIVOS_DE_CANCELACION} from '../../../data/catalogos';

@Component({
  selector: 'app-form-cancelar-factura',
  templateUrl: './form-cancelar-factura.component.html',
  styleUrls: ['./form-cancelar-factura.component.scss']
})
export class FormCancelarFacturaComponent implements OnInit {
  loading: boolean;
  form: FormGroup;
  matcher: StandardErrorStateMatcher;
  MOTIVOS_DE_CANCELACION = MOTIVOS_DE_CANCELACION;
  isDocumentRelatedFieldVisible = false;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.matcher = new StandardErrorStateMatcher();
    this.form = this.formBuilder.group({
      motive: [null, Validators.required],
      substitution: ['']
    });
  }

  ngOnInit(): void {

  }

  onMotiveChange(motiveId): void {
    if (motiveId === '01') {
      this.isDocumentRelatedFieldVisible = true;
      this.form.get('substitution').setValidators([Validators.required, Validators.pattern(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)]);
    } else {
      this.isDocumentRelatedFieldVisible = false;
      this.form.get('substitution').clearValidators();
    }
    this.form.get('substitution').updateValueAndValidity();
  }

  getFormData(): any {
    return {
      motive: this.form.get('motive').value,
      substitution: this.form.get('motive').value === '01' ? this.form.get('substitution').value : undefined,
    };
  }
}
