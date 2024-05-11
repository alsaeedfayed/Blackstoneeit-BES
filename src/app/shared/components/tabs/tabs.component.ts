import {
  Component,
  ContentChildren,
  OnInit,
  Output,
  QueryList,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TabComponent } from './components/tab/tab.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void { }
  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }


  selectTab(tab: TabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach((tab) => (tab.active = false));
    // activate the tab the user has clicked on.
    tab.active = true;
    this.change.emit(tab.value);
  }
}
