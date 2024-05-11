import { PopupService } from 'src/app/shared/popup/popup.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit {
  @Input() id: any;
  @Input() msg: string;
  @Output() acceptEvent = new EventEmitter();
  constructor(private popupSer:PopupService) { }

  ngOnInit(): void {
  }

  discardModal(){
    this.popupSer.close()
  }

}
