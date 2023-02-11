import { createAction, props } from "@ngrx/store";
import { Productos } from "src/app/models/productos.model";

export const cargandoProductos = createAction('[Productos] Loading Productos')
export const cargarProductosSuccess = createAction('[Productos] Cargar Productos Success',
    props<{ productos: Productos[] }>()
)
export const cargarProductosFail = createAction('[Productos] Cargar Productos Fail',
    props<{ payload: any }>()
)
