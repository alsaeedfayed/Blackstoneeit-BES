import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {

  constructor() { }

  open(id= null) {
    if (id) $(`#${id}`).modal('show');
    else $('#basicModalCenter').modal('show');
  }

  close(id = null) {
    if (id) $(`#${id}`).modal('hide');
    else $('#basicModalCenter').modal('hide');
  }

}
