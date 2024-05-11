import { CrFrequencyComponent } from './components/frequency/frequency.component';
import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Output, OnDestroy,ViewChild, AfterViewInit, OnChanges, SimpleChanges } from "@angular/core";
import { TargetAndFrequencyModel } from "./targetAndFrequency.model";

@Component({
    selector: 'cr-target-frequency',
    templateUrl: './targetAndFrequency.component.html',
    styleUrls: ['./targetAndFrequency.component.scss'],
    providers: [TargetAndFrequencyModel]
})

export class CrTargetAndFrequencyComponent implements OnDestroy,AfterViewInit {
    @Output() setFreqData = new EventEmitter();
  @ViewChild(CrFrequencyComponent) freqComp: CrFrequencyComponent;
    //=======================Constructor==================
    constructor(public model: TargetAndFrequencyModel) {
      model.SetDataEvt.pipe(takeUntil(model.endSub$)).subscribe((data)=>this.setFreqData.emit(data))
    }
  ngAfterViewInit(): void {
    this.model.freqComp = this.freqComp;
  }

  ngOnDestroy(){
    this.model.endSubs();
  }

}
