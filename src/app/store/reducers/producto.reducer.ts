import { createReducer, Action, on } from '@ngrx/store'
import { IPayloadError } from 'src/app/constants'
import { Productos } from "src/app/models/productos.model"
import { cargandoProductos, cargarProductosFail, cargarProductosSuccess, saveProductos, saveProductosFail, saveProductosSuccess } from '../actions/producto.action'



export interface ProductosState {
    productos: Productos[]
    loading: boolean
    success:boolean
    errorDetail: IPayloadError
    error:boolean
}

const errorInitState: IPayloadError = {
    url: '',
    name: '',
    message: ''
}

export const initialStateProductos: ProductosState = {
    productos: [],
    loading: false,
    success:false,
    errorDetail: errorInitState,
    error:false
}

const _cargarProductos = createReducer(initialStateProductos,
    on(cargandoProductos, state => ({ ...state, loading: true, success: false })),
    on(cargarProductosSuccess, (state, action) => ({
        ...state,
        loading: false,
        error:false,
        productos: [...action.productos]
    })),
    on(cargarProductosFail, (state, { payload }) => ({
        ...state,
        loading: false,
        error:true,
        errorDetail: {
            url: payload.url,
            name: payload.url,
            message: payload.message
        }
    })),

    on(saveProductos, state => ({ ...state, loading: true, success: false })),
    on(saveProductosSuccess, state => ({ ...state, loading: false, success: true, error: false })),    
    on(saveProductosFail, (state,  {payload} ) => ({
        ...state,
        loading: false,
        success: false,
        error: true,
        errorDetail: {
            url: '',
            name: '',
            message:  payload.message
        }
    })),
    
    

)


export const productosReducer = (state = initialStateProductos, action: Action) => {
    return _cargarProductos(state, action)
}
