import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "src/app/store/app.reducers";

export const getProductsState = createFeatureSelector<AppState>('productos')

export const getErrorDetail = createSelector(getProductsState,(state:AppState)=>state.productos.errorDetail)
export const getError = createSelector(getProductsState,(state:AppState)=>state.productos.error)
