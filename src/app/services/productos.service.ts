import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Productos } from '../models/productos.model';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private url: string = 'http://127.0.0.1:8000'

  constructor(private httpClient: HttpClient) { }

  getProductos() {
    return this.httpClient.get(`${this.url}/api/productos/`)
    .pipe(map((res: any) => res['data']))

  }

  saveProductos(productos:Productos){
    return this.httpClient.post(`${this.url}/api/productos/`, productos)
      .pipe(map((res: any) => res))
  }

}
