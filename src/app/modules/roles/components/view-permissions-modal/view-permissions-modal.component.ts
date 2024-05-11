import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from 'src/app/shared/popup/popup.service';

@Component({
  selector: 'app-view-permissions-modal',
  templateUrl: './view-permissions-modal.component.html',
  styleUrls: ['./view-permissions-modal.component.scss'],
})
export class ViewPermissionsModalComponent implements OnInit {
  @Input() role;
  lang: string = this.translateService.currentLang;

  constructor(private popupService: PopupService, private translateService: TranslateService) {}

  ngOnInit(): void {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  onPopupClose() {
    this.popupService.close();
  }
}
