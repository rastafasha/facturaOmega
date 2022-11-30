import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnChanges
} from '@angular/core';


import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: []
})
export class FiltrosComponent implements OnChanges {

  formFilters: FormGroup;
  listValues: any[] = [];

  @Input() id = 'Filtro';
  @Input() title = 'Filtros de búsqueda';
  @Input() placeholder: string = 'Buscar...';
  @Input() disabled: boolean = false;
  @Input() activated: boolean = false;
  @Input() whenValuesChange: boolean = false;
  @Input() showClearFilters: boolean = false;
  @Input() fieldFilters: any[] = [];

  @Output() onFiltered: EventEmitter<any> = new EventEmitter<any>();
   
   //----------------------------------------------------------------
  // Constantes
  //----------------------------------------------------------------
  TEXTO = 1;
  NUMERO = 2;
  FECHA = 3;
  CHECKBOX = 4;
  LISTA_DESPLEGABLE = 5;
  LISTA_SELECCION_MULTIPLE = 6;
  NULL = null;


  constructor(private _fb: FormBuilder) {}  
 
 
  ngOnChanges(): void {
    let fields: any = {};  
  
    for (let i in this.fieldFilters) {
      fields[this.fieldFilters[i].name] = this.fieldFilters[i].default ? this.fieldFilters[i].default : null;
    }   
    this.formFilters = this._fb.group(fields);
  }

  
  
  toggle(): void {
    this.activated = !this.activated;
    this.formFilters.disable();
    this.setFocusPrimero();
  }



  setFocusPrimero(campo?: any) { 
    if (this.fieldFilters.length == 0) return;
    
    if (campo) {
      this.formFilters.enable();
      campo.focus();
    } else {
      setTimeout(() =>{
        const meta = this.fieldFilters[0] || {};
        this.setFocusPrimero(document.getElementById(meta.name));
      }, 50);
    }
  }


  onKey(): void {
   if (this.whenValuesChange) {
    this.buildFilters();
   }
  }

  dateSelected(): void {
   if (this.whenValuesChange) {
    this.buildFilters();     
   }
  }

  checked(): void {
    if (this.whenValuesChange) {
      this.buildFilters();     
    }
  }

  selected(): void {
    if (this.whenValuesChange) {
     this.buildFilters();
    }
  }

  buildFilters(): void {
    let filters: any = {};
    this.listValues = [];

    for (let i in this.fieldFilters) {      
      const name: string = this.fieldFilters[i].name;
      filters[name] = this.formFilters.get(name).value;

      if (this.fieldFilters[i].default && !this.formFilters.get(name).value) {
        this.formFilters.get(name).setValue(this.fieldFilters[i].default);
        filters[name] = this.fieldFilters[i].default;
      }
      
      if (filters[name]) {
        let value: string = filters[name];
        if (this.fieldFilters[i].data) {
          value = this.fieldFilters[i].data.find(d => d.id === value).value;

        }   
        this.listValues.push({ name, value });
      }

      if (!filters[name]) delete filters[name];
    }
    
    this.onFiltered.emit(filters);
  }

  getFieldFilter(name: string): any {
    return this.fieldFilters.find(field => field.name === name) || {};
  }

  submit(): void {
    this.buildFilters();
  }

  remove(filter: any): void {
    this.formFilters.get(filter.name).setValue(null);
    this.buildFilters();
  } 


}
