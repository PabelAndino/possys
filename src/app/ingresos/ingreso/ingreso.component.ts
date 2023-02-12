import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SortableDirective, SortEvent } from 'src/app/directives/sortable.directive';
import { Productos } from 'src/app/models/productos.model';
import { SearchProductTableService } from 'src/app/services/search.product.table.service';
import { cargandoProductos } from 'src/app/store/actions';
import { AppState } from 'src/app/store/app.reducers';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',

  styles: [
  ]
})
export class IngresoComponent implements OnInit {

  productosList$!: Observable<Productos[]>

  @ViewChildren(SortableDirective)
  headers!: QueryList<SortableDirective>

  constructor(private modalService: NgbModal, private store: Store<AppState>, public tableService: SearchProductTableService) {
    this.productosList$ = tableService.productos$
  }



  ngOnInit(): void {
    this.store.dispatch(cargandoProductos())
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


}
