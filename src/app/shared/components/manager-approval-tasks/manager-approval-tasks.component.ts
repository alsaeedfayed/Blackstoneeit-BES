import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModelService } from '../model/model.service';
import ar from '@angular/common/locales/ar';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-manager-approval-tasks',
  templateUrl: './manager-approval-tasks.component.html',
  styleUrls: ['./manager-approval-tasks.component.scss'],
})
export class ManagerApprovalTasksComponent implements OnInit {
  @Input() tasks: any[] = [];
  lang: string;

  constructor(private translateService: TranslateService) {
    registerLocaleData(ar); // for date pipe
  }

  ngOnInit(): void {
    this.lang = this.translateService.currentLang;
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  getRols(roles: []) {
    return roles?.join();
  }
}
