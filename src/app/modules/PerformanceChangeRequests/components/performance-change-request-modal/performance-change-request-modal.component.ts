import { takeUntil } from 'rxjs/operators';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { changeRequestPopupModel } from './performance-change-request-modal.model';

@Component({
  selector: 'performance-change-request-modal',
  templateUrl: './performance-change-request-modal.component.html',
  styleUrls: ['./performance-change-request-modal.component.scss'],
  providers: [changeRequestPopupModel]
})
export class PerformanceChangeRequestModalComponent implements OnInit {

  public KBIs = [];
  @Output() updateListEvt:EventEmitter<any> = new EventEmitter()
  public language;
  constructor(public model: changeRequestPopupModel,private fb: FormBuilder, private translateSer:TranslateService,private popupSer:PopupService) {
    this.language = this.translateSer.currentLang;
    this.model.updateList.pipe(takeUntil(this.model.endSub$)).subscribe((data)=>this.updateListEvt.emit(data))
  }

  ngOnInit(): void {
  }

  public closePopup(){
    this.popupSer.close()
  }



}
