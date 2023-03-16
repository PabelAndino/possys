
import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';

import { map, Observable, Subject, Subscription } from 'rxjs';
import { IPayloadError } from 'src/app/constants';
import { SortableDirective, SortEvent } from 'src/app/directives/sortable.directive';
import { Productos } from 'src/app/models/productos.model';
import { SearchProductTableService } from 'src/app/services/search.product.table.service';
import { cargandoProductos, saveProductos } from 'src/app/store/actions';
import { AppState } from 'src/app/store/app.reducers';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',

  styleUrls: 
     [ './ingreso.component.scss'
]
  
})
export class IngresoComponent implements OnInit, OnDestroy, AfterViewInit {

  //productosList$!: Observable<Productos[]>
  //Datatable data config



  productos!: Productos[]

  columns = [
    {
      prop: 'codigo'
    },
    {
      prop: 'nombre'
    },
    {
      prop: 'categoria.nombre',
      name: 'Categoria'
    }
  ]

  cols = [
    { field: 'codigo', header: 'Codigo' },
    { field: 'nombre', header: 'Nombre' },
    { field: 'categoria', header: 'Categoria' },
  ]


  error!: any

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


      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al proceder con la accion con productos',
          text: `${JSON.stringify(errorDetail.message)}`
        })
      }

      if (this.savedSuccess) {
        /* Hacer un dispatch de cargar productos */
        
        Swal.fire({
          icon: 'success',
          title: 'Guardado Correctamente',
          text: `Producto Guardo correctamente`
        }).then((result) => {
          if (result.isConfirmed) {
            this.store.dispatch(cargandoProductos())
          } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
          }
        })


      }
    })


  }


  ngAfterViewInit(): void {
    // this.dtTrigger.next(null)
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
    this.store.dispatch(saveProductos({ payload: this.productForm.value }))

  }


  verifyField(field: string) {
    return this.productForm.controls[field].touched && this.productForm.controls[field].errors
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.productos);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "products");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}


