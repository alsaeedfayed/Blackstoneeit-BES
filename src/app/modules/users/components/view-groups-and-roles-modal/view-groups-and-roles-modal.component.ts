import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PopupService } from 'src/app/shared/popup/popup.service';

@Component({
  selector: 'app-view-groups-and-roles-modal',
  templateUrl: './view-groups-and-roles-modal.component.html',
  styleUrls: ['./view-groups-and-roles-modal.component.scss']
})
export class ViewGroupsAndRolesModalComponent implements OnInit {

  @Input() user;

  private endSub$ = new Subject();

  lang: string = this.translate.currentLang;

  constructor(
    private translate: TranslateService,
    private popupService: PopupService,
  ) { }

  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.lang = this.translate.currentLang;
      });
  }

  onPopupClose() {
    this.popupService.close();
  }
}
