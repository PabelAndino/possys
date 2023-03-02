import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of, tap } from "rxjs";
import { ProductosService } from "src/app/services/productos.service";
import * as productosActions from '../actions'

@Injectable()
export class ProductosEffects {
    constructor(private actions$: Actions,
        private productoService: ProductosService) { }


    cargarProductos$ = createEffect(
        () => this.actions$.pipe(
            ofType(productosActions.cargandoProductos),
            //tap(data=>console.log(data))
            mergeMap(
                () => this.productoService.getProductos()
                    .pipe(
                        map(productos => productosActions.cargarProductosSuccess({ productos: productos })),
                        catchError(error => of(productosActions.cargarProductosFail({ payload: error })))
                    )
            )
        )
    )

    crearProducto$ = createEffect(() =>
        this.actions$.pipe(
            ofType(productosActions.saveProductos),
            mergeMap((action) =>{
                console.log(action.payload)
             return   this.productoService.saveProductos(action.payload).pipe(
                    map(() => productosActions.saveProductosSuccess()),
                    catchError(error => of(productosActions.saveProductosFail({ payload: error })))
                )}
            )
        )
    )

}