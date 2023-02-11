import { ActionReducerMap } from '@ngrx/store'
import * as reducers from './reducers'

export interface AppState {
    productos: reducers.ProductosState
}

export const appReducer: ActionReducerMap<AppState> = {
    productos: reducers.productosReducer
}

