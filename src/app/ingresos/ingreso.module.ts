import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngresoComponent } from './ingreso/ingreso.component';
import { ProductosComponent } from './productos/productos.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    IngresoComponent,
    ProductosComponent,
    ProveedoresComponent
  ],
  imports: [
    CommonModule,
    NgbModalModule,
    FormsModule
  ],
  exports:[
    IngresoComponent,
  ]
})
export class IngresoModule { }
