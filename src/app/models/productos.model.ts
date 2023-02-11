export class Productos {

    constructor(
        public id: number,
        public nombre: string,
        public categoria: number,
        public descripcion: string,
        public estado?: boolean

    ) {  }
}