import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';

@Component({
  selector: 'performance-dashboard-details',
  templateUrl: './performance-dashboard-details.component.html',
  styleUrls: ['./performance-dashboard-details.component.scss'],
})

export class PerformanceDashboardDetailsComponent implements OnInit {

  private endSub$ = new Subject();
  public lang = this.translate.currentLang;
  public loading: boolean = false;
  public data: any;
  
  constructor(translateService: TranslateConfigService, private translate: TranslateService, private httpHandlerService: HttpHandlerService) {
   // super(translateService, translate);
    this.hanldeLangChange();
  }

  ngOnInit(): void { }

  private hanldeLangChange() {
    this.translate.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
      this.lang = this.translate.currentLang;
    });
  }

  private getDetails() {
    this.loading = true;
    // const url = `${Config.PerformanceDashboard.GetSubgroupPerformance}/${this.selectedScoreCardId}/${this.selectedGroupId}`;
    // this.httpHandlerService.get(url)
    // .pipe(
    //     takeUntil(this.endSub$),
    //     finalize(() => (this.loading = false))
    // )
    // .subscribe(res => {
    //     if(res) 
    //         this.data = res;
    // })
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }

}



