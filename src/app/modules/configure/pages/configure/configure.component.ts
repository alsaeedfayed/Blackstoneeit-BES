import { Component, OnInit } from '@angular/core';
import { Configuration } from 'src/app/core/models/Configuration';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { Tab } from 'src/app/design-system/components/tabs-menu/tab';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})

export class ConfigureComponent extends ComponentBase implements OnInit {

  [x: string]: any;
  config:Configuration[]=[];
  isShowForm:boolean=false;
  clicked: boolean = false;
  isActive:boolean=true;
  data:string;
  loading: boolean = false;
  totalItems: number = 0;
  paginationModle: any = {
    pageIndex: 1,
    pageSize: 30,
  };
  public lang = this.translate.currentLang;

  tabs: Tab[] = [
    {
      icon: 'bx bx-notepad',
      label: 'Manage Scorecards',
      labelAr: 'إدارة المخططات',
      route: 'manage-scorecards',
    },
    {
      icon: 'bx bx-windows',
      label: 'Manage Submission Windows',
      labelAr: 'إدارة نوافذ ادخال النتائج',
      route: 'window-config',
    },
    {
      icon: 'bx bx-customize',
      label: 'Manage Goal Types',
      labelAr: 'إدارة أنواع الهدف',
      route: 'goal-type',
    },
  ];

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
  ) {
    super(translateService, translate);
  }
  
  ngOnInit(): void {  
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

}
