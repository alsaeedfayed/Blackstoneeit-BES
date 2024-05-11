import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SidePanelService {

  constructor() { }

  show() {        
    $('#side-panel').fadeIn(400).modal('show');
  }

  hide() {    
    $('#side-panel').fadeOut(400).modal('hide');
  }

  scrollToTop() {
    $('.modal-body').scrollTop(0);
  }

}
