export interface Categoria {
    nombre: string
}
export class Productos {

    
    constructor(
        public id: number,
        public codigo:string,
        public nombre: string,
        public categoria: Categoria,
        public descripcion: string,
        public estado: boolean

    ) {  }
}