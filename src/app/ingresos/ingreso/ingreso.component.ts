import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Productos } from 'src/app/models/productos.model';
import { cargandoProductos } from 'src/app/store/actions';
import { AppState } from 'src/app/store/app.reducers';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styles: [
  ]
})
export class IngresoComponent implements OnInit {
  constructor(private modalService: NgbModal, private store:Store<AppState>){}

  productos:Productos[]= []
  ngOnInit(): void {
    console.log('Data')
    this.store.select('productos').subscribe(({productos})=>{
     this.productos = productos
    })
    this.store.dispatch(cargandoProductos())
  }

  productoModalOpen(data:any){
    this.modalService.open(data, { size: 'xl', centered: true })
  }


}
