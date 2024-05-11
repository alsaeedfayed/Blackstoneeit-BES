import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }
  show() {
    $('.toast').toast('show')
  }

  hide() {
    $('.toast').toast('hide')
  }
}
