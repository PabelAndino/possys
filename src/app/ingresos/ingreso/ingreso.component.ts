import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styles: [
  ]
})
export class IngresoComponent {
  constructor(private modalService: NgbModal){}
  clienteModalOpen(data:any){
    this.modalService.open(data)
  }
}
