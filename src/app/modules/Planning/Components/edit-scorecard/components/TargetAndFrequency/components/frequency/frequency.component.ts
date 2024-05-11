import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { frquencyType, measurmentType } from './../../enum';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FrequencyModel } from './frequency.model';

@Component({
  selector: 'cr-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.scss'],
  providers: [FrequencyModel]
})
export class CrFrequencyComponent implements OnInit,OnDestroy {
  @Input() public set selectedFreq(selectedFreq: frquencyType) {
    this.model.selectedFreq = selectedFreq;
    this.model.initForm()
  }
  @Input() public set selectedType(selectedType: measurmentType) {
    this.model.selectedType = selectedType;
  }
  @Input() isShowOnlyInternalWeight:boolean = false;
  @Output() setFreqMeasurementEvt = new EventEmitter();



  constructor(public model: FrequencyModel) {
    this.model.setFreqMeasurementEvt.pipe(takeUntil(this.model.endSub$)).subscribe((data)=>this.setFreqMeasurementEvt.emit(data))
   }



  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.model.endSubs()
  }

}
