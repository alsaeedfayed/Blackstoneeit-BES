
import { Injectable } from '@angular/core';
import { Modal } from 'bootstrap';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ModelService {
  modal: Modal | undefined;
  closeModel$: Subject<any> = new Subject();
  constructor() {
  }

  open(id) {
    this.modal = new Modal(document.getElementById(id))
    this.modal.show()
  }

  close() {
    if (this.modal) this.modal.hide()
  }

}
