import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartType, Chart } from 'chart.js';

@Component({
  selector: 'committee-performance-dashboard',
  templateUrl: './committee-performance.component.html',
  styleUrls: ['committee-performance.scss']
})
export class committeePerformanceDashboard implements OnInit {


  @Input() performanceData : any
  gaugeType = "semi";
  attendanceRateValue = 20;
  attendanceRateLable: string;
  kpiValue = 40;
  kpiLable: string
  taskProgressValue = 33;
  taskProgressLable: string
  @Input() language : any
  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
    this.GetTranslations()
    this.handleLanguageChange()
  }

  GetTranslations() {
    this.translate.get('committeeDashboard.dashboard.attendanceRate').subscribe(res => {
      this.attendanceRateLable = res
    })

    this.translate.get('committeeDashboard.dashboard.kpiPerformance').subscribe(res => {
      this.kpiLable = res
    })

    this.translate.get('committeeDashboard.dashboard.taskProgress').subscribe(res => {
      this.taskProgressLable = res
    })
  }

  handleLanguageChange() {
    this.translate.onLangChange.subscribe(lang => {
      this.GetTranslations()
    })
  }






}
