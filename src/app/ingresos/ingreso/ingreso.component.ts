import { DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';
import { IPayloadError } from 'src/app/constants';
import { SortableDirective, SortEvent } from 'src/app/directives/sortable.directive';
import { Productos } from 'src/app/models/productos.model';
import { SearchProductTableService } from 'src/app/services/search.product.table.service';
import { cargandoProductos, saveProductos } from 'src/app/store/actions';
import { AppState } from 'src/app/store/app.reducers';
import Swal from 'sweetalert2';
import { getError, getErrorDetail } from '../selectors/ingreso.selectors';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',

  styles: [
  ]
})
export class IngresoComponent implements OnInit, OnDestroy {

  productosList$!: Observable<Productos[]>

  savedSuccess$: Observable<boolean>
  error!: any
  //errorDetails$!: Observable<string | undefined | IPayloadError>
  errorDetail: Subscription = new Subscription()
  errorDetails!:any

  form: FormGroup = this.formBuilder.group({
    codigo: ['', Validators.required],
    categoria: ['', Validators.required],
    nombre: ['', Validators.required],
    cantidad: ['', [Validators.required,
    Validators.pattern("^[0-9]*$"),
    Validators.minLength(10), Validators.maxLength(10)]]
  })

  @ViewChildren(SortableDirective)
  headers!: QueryList<SortableDirective>

  constructor(private modalService: NgbModal, private store: Store<AppState>, public tableService: SearchProductTableService, private formBuilder: FormBuilder) {
    this.productosList$ = tableService.productos$
    this.savedSuccess$ = this.store.pipe(select('productos','success'))
    
    //this.store.select(getErrorDetail)
     
  }


  ngOnInit(): void {
    this.store.dispatch(cargandoProductos())
    this.store.select('productos').subscribe(({ errorDetail, error }) => {
       this.errorDetails = errorDetail
       this.error = error
    })
    
  }
  ngOnDestroy(): void {
    this.errorDetail.unsubscribe()
  }

  productoModalOpen(data: any) {
    this.modalService.open(data, { size: 'xl', centered: true })
  }

  /**
  * Sort table data
  * @param param0 sort the column
  *
  */
  onSort({ column, direction }: SortEvent) {

    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.tableService.sortColumn = column;
    this.tableService.sortDirection = direction;
  }

  guardarProducto() {
    this.store.dispatch(saveProductos({ payload: this.form.value }))
    let message = this.errorDetails
    console.log(message, 'message')

    /*  if(!this.error$){
       this.store.dispatch(cargandoProductos())
     }else{
       Swal.fire({
         icon:'error',
         title:'No se pudo guardar el producto',
         text: `${this.errorDetails$}`
       })
     } */
  }


}
