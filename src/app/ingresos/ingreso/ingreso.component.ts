import { DecimalPipe } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { DataTableDirective } from 'angular-datatables';
import { map, Observable, Subject, Subscription } from 'rxjs';
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
export class IngresoComponent implements OnInit, OnDestroy, AfterViewInit {

  //productosList$!: Observable<Productos[]>
  //Datatable data config
  @ViewChild(DataTableDirective, { static: false })
  datatableElements!: DataTableDirective

  productos!: Productos[]
  dtTrigger: Subject<any> = new Subject()


  error!: any
  dtOptions: DataTables.Settings = {}

  errorDetail: Subscription = new Subscription()
  savedSuccess: boolean = false
  errorDetails!: any

  productForm: FormGroup = this.formBuilder.group({
    codigo: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['', [Validators.required, Validators.minLength(1)]],
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    cantidad: ['0', [Validators.required,
    Validators.pattern("^[0-9]*$"),
    Validators.minLength(0), Validators.maxLength(10)]]
  })

  @ViewChildren(SortableDirective)
  headers!: QueryList<SortableDirective>

  constructor(private modalService: NgbModal, private store: Store<AppState>, public tableService: SearchProductTableService, private formBuilder: FormBuilder) {
    //this.productosList$ = tableService.productos$
    //this.store.select(getErrorDetail)
  }


  ngOnInit(): void {
    this.store.dispatch(cargandoProductos())
    this.store.select('productos').subscribe(({ errorDetail, error, productos, success }) => {
      this.errorDetails = errorDetail
      this.error = error
      this.productos = productos
      this.savedSuccess = success

      this.dtTrigger.next(null)


      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo guardar el producto',
          text: `${JSON.stringify(errorDetail.message)}`
        })
      }

      if (this.savedSuccess) {
        
        Swal.fire({
          icon: 'success',
          title: 'Guardado Correctamente',
          text: `Producto Guardo correctamente`
        })
      }
    })


    this.dtOptions = {
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json'
      },
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      deferRender: true,
      destroy: true
    }

  }


  ngAfterViewInit(): void {
    // this.dtTrigger.next(null)
  }


  ngOnDestroy(): void {
    this.errorDetail.unsubscribe()
    this.dtTrigger.unsubscribe();
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
    this.store.dispatch(saveProductos({ payload: this.productForm.value }))

  }

  recargarTable() {
    this.datatableElements.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy()
     
    })
    setTimeout(() => {
      this.dtTrigger.next(null);

    });
  }

  verifyField(field: string) {
    return this.productForm.controls[field].touched && this.productForm.controls[field].errors
  }

}


