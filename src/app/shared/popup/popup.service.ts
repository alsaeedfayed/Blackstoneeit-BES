import { BehaviorSubject, Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { Modal } from 'bootstrap';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  data: BehaviorSubject<any> = new BehaviorSubject(null);
  data$ = this.data.asObservable();
  private reset = new Subject();
  reset$ = this.reset.asObservable();

  modal: Modal | undefined;
  constructor() {}

  open(id, data = null) {
    this.modal = new Modal(document.getElementById(id));
    this.modal.show();
    this.data.next(data);
  }

  close() {
    if (this.modal) {
      this.modal.hide();
      this.resetPopup();
    }
  }

  resetPopup() {
    this.data.next(null);
    this.reset.next(true);
    this.reset.next(false);
  }
}
