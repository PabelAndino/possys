import { createAction, props } from "@ngrx/store";
import { IPayloadError } from "src/app/constants";
import { Productos } from "src/app/models/productos.model";

export const cargandoProductos = createAction('[Productos] Loading Productos')
export const cargarProductosSuccess = createAction('[Productos] Cargar Productos Success',
    props<{ productos: Productos[] }>()
)
export const cargarProductosFail = createAction('[Productos] Cargar Productos Fail',
    props<{ payload: any }>()
)

export const saveProductos = createAction('[Productos] Saving Productos', props<{ payload: Productos }>())
export const saveProductosSuccess = createAction('[Productos] Save Productos Success')
export const saveProductosFail = createAction('[Productos] Save Productos Fail', props<{ payload: any }>())
