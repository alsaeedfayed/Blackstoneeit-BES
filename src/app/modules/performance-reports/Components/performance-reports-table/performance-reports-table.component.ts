import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AchievementStatus } from '../../Enums/enums';

@Component({
  selector: 'performance-reports-table',
  templateUrl: './performance-reports-table.component.html',
  styleUrls: ['./performance-reports-table.component.scss']
})
export class PerformanceReportsTableComponent implements OnInit,OnDestroy {
  private endSub$ = new Subject()
  public language: string = this.translateService.currentLang;
  AchievementStatusEnum = AchievementStatus;
  paginationModle: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  // Inputs & Outputs
  @Input() list: any[] = [];
  constructor(private translateService:TranslateService) {
    this.handleLangChnage()
  }


  ngOnInit(): void {
  }

  private handleLangChnage(){
    this.translateService.onLangChange.pipe().subscribe(()=>{
      this.language = this.translateService.currentLang;
    })
  }

  onPaginate(e:number) {
    this.paginationModle.pageIndex = e;
  }

  public getMeasurmentMethodText(val: number) {
    switch (val) {
      case 1:
        return this.translateService.instant('performanceReports.%Percentage');
      case 2:
        return this.translateService.instant('performanceReports.#Number');
      case 4:
        return this.translateService.instant('performanceReports.$Currency');
      case 5:
        return this.translateService.instant('performanceReports.date');
      case 6:
        return this.translateService.instant('performanceReports.subGoal');
      default:
        return this.translateService.instant('shared.N/A');
    }
  }

  public getMeasurmentUnit(val: number) {
    switch (val) {
      case 1:
        return "%"
      case 2:
        return ""
      case 4:
        return this.translateService.currentLang == "en" ? " AED" : "درهم "
      case 5:
        return ""
      case 6:
        return ""
      default:
        return ""
    }
  }

  ngOnDestroy(): void {
    this.endSub$.next(null)
    this.endSub$.complete()
  }

}
