import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { IngresoComponent } from './ingreso/ingreso.component';
import { ProductosComponent } from './productos/productos.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import {NgbDropdownModule, NgbModalModule, NgbPaginationModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortableDirective } from '../directives/sortable.directive';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';



@NgModule({
  declarations: [
    IngresoComponent,
    ProductosComponent,
    ProveedoresComponent,
    SortableDirective,
  ],
  imports: [
    CommonModule,
    NgbModalModule,
    FormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    ReactiveFormsModule,
    NgxDatatableModule

  ],
  providers: [DecimalPipe],
  exports:[
    IngresoComponent,
  ]
})
export class IngresoModule { }
