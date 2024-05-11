import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ICustomTab } from './ICustomTab.interfcae';

@Component({
  selector: 'tabs',
  templateUrl: './custom-tabs.component.html',
  styleUrls: ['./custom-tabs.component.scss']
})
export class CustomTabsComponent implements OnInit {
  // PROPS
  public activeTabIndex: number = 1;
  // INPUTS & OUTPUTS
  @Input() tabs: ICustomTab[] = [];
  @Input() errMsg: string;
  @Output() activeTabChanged: EventEmitter<number> = new EventEmitter();
  constructor(private toastService: ToastrService, private translateService: TranslateService) { }

  ngOnInit(): void {
  }

  public activateTabHandler(tab: ICustomTab) {
    if (!tab.disbaled) {
      this.activeTabIndex = tab.tabIndex;
      this.activeTabChanged.emit(tab.tabIndex)
    } else {
      if (this.errMsg) {
        this.toastService.error(this.errMsg);
      }
    }
  }

}
