import { DecimalPipe } from '@angular/common';
import { Injectable, OnInit, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, debounceTime, delay, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { SortColumn, SortDirection } from '../directives/sortable.directive';
import { Categoria, Productos } from '../models/productos.model';
import { cargandoProductos } from '../store/actions';
import { AppState } from '../store/app.reducers';


interface SearchResult {
  productos: Productos[]
  total: number
}

interface State {
  page: number
  pageSize: number
  searchTerm: string
  sortColumn: SortColumn
  sortDirection: SortDirection
  startIndex: number
  endIndex: number
  totalRecords: number
}


const compare = (v1: string | number | Categoria | boolean, v2: string | number | Categoria | boolean) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(productos: Productos[], column: SortColumn, direction: string): Productos[] {
  if (direction === '' || column === '') {
    return productos;
  } else {
    return [...productos].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(productos: Productos, term: string, pipe: PipeTransform) {
  return productos.codigo.toLowerCase().includes(term.toLowerCase())
    || productos.nombre.toLowerCase().includes(term.toLowerCase())

    ;

}


@Injectable({
  providedIn: 'root'
})
export class SearchProductTableService implements OnInit {
  private _loading$ = new BehaviorSubject<boolean>(true)
  private _search$ = new Subject<void>()
  private _productos$ = new BehaviorSubject<Productos[]>([])
  private _total$ = new BehaviorSubject<number>(0)
  private products: Productos[] = []

  private _state: State = {
    page: 1,
    pageSize: 5,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    startIndex: 0,
    endIndex: 9,
    totalRecords: 0
  };
  constructor(private pipe: DecimalPipe, private store: Store<AppState>) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false)),

    ).subscribe(result => {
      this._productos$.next(result.productos)
      this._total$.next(result.total)
    })
    this._search$.next()

  }

  ngOnInit(): void {
    this.store.select('productos').subscribe(({ productos }) => {
      this.products = productos

    })

  }



  get totalRecords() { return this._state.totalRecords; }
  get pageSize() { return this._state.pageSize; }
  get endIndex() { return this._state.endIndex; }
  get searchTerm() { return this._state.searchTerm; }
  get productos$() { return this._productos$.asObservable(); }

  set totalRecords(totalRecords: number) { this._set({ totalRecords }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set endIndex(endIndex: number) { this._set({ endIndex }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch)
    this._search$.next()
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;
    this.store.select('productos').subscribe(({ productos }) => {
      this.products = productos

    })
    const data = [
      { "id": 3, "codigo": "9855126598", "nombre": "Lapiz Azul Bic", "descripcion": "", "estado": true, "categoria": { "nombre": "Articulos de oficina" } },
      { "id": 2, "codigo": "744145235", "nombre": "Calculadora digital", "descripcion": "", "estado": true, "categoria": { "nombre": "Articulos de oficina" } },
      { "id": 4, "codigo": "847512653", "nombre": "Pad para escritorio", "descripcion": "", "estado": true, "categoria": { "nombre": "Articulos de oficina" } },
      { "id": 1, "codigo": "541254265", "nombre": "Papel resma A4", "descripcion": "", "estado": true, "categoria": { "nombre": "Articulos de oficina" } }]

    // 1. sort
    let productosSort = sort(this.products, sortColumn, sortDirection);

    // 2. filter
    productosSort = productosSort.filter(productos => matches(productos, searchTerm, this.pipe));
    const total = productosSort.length;

    // 3. paginate
    this.totalRecords = productosSort.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    productosSort = productosSort.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({ productos: productosSort, total });
  }

}
