import { createReducer, Action, on } from '@ngrx/store'
import { Productos } from "src/app/models/productos.model"
import { cargandoProductos, cargarProductosFail, cargarProductosSuccess } from '../actions/producto.action'

interface IPayloadError {
    url: string,
    name: string,
    message: string
}


export interface ProductosState {
    productos: Productos[]
    loading: boolean
    error: IPayloadError
}

const errorInitState: IPayloadError = {
    url: '',
    name: '',
    message: ''
}

export const initialStateProductos: ProductosState = {
    productos: [],
    loading: false,
    error: errorInitState
}

const _cargarProductos = createReducer(initialStateProductos,
    on(cargandoProductos, state => ({ ...state, loading: true })),
    on(cargarProductosSuccess, (state, action) => ({
        ...state,
        loading: false,
        productos: [...action.productos]
    })),
    on(cargarProductosFail, (state, { payload }) => ({
        ...state,
        loading: false,
        error: {
            url: payload.url,
            name: payload.url,
            message: payload.message
        }
    }))

)

export const productosReducer = (state = initialStateProductos, action: Action) => {
    return _cargarProductos(state, action)
}