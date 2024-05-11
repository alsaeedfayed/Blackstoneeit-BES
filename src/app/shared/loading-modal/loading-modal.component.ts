import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
declare let $: any;

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.scss']
})
export class LoadingModalComponent implements OnInit, OnChanges {
  @Input() displayModal:boolean
  @Input() content:string
  constructor() { }

  ngOnInit() {
    $('#loadingModal').modal('show');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.displayModal?.currentValue){      
      $('#loadingModal').modal('show');
      $("body").addClass("modal-open")
    }else{
      $('#loadingModal').modal('hide');
      $("body").removeClass("modal-open")
    }

  }

}
