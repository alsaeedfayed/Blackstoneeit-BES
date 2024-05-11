import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';
import { AnyCnameRecord } from 'dns';
@Component({
  selector: 'app-active-statuses',
  templateUrl: './active-statuses.component.html',
  styleUrls: ['./active-statuses.component.scss']
})
export class ActiveStatusesComponent implements OnInit, AfterViewInit {

  @ViewChild('activeStatusChart') activeStatusChart
  chart: any
  canvas: any
  ctx: any
  data: any
  languange: string = this.translateService.currentLang


  @Input('data') set daata(data: any) {
    if (data) {
      this.data = data
    //  console.log('ch data' , data)
      //createChat
      this.createChart()
    }
  }
  constructor(
    private translateService: TranslateService,
  ) { }

  ngAfterViewInit(): void {
    // if (this.chart) this.chart.destroy()
    // this.createChart()
  }

  ngOnInit(): void {
    this.handleLangChange()
  }

  createChart() {
    if (this.chart) this.chart.destroy()
    // this.createChart()
    const chartLabels = [
      this.translateService.instant('committeeDashboard.dashboard.highlyActive'),
      this.translateService.instant('committeeDashboard.dashboard.lowActive'),
      this.translateService.instant('committeeDashboard.dashboard.notActive'),
    ]
    const chartData = {
      labels: [...chartLabels],
      datasets: [
        {
          data: [
            this.data?.highActivity,
            this.data?.lowActivity,
            this.data?.notActive
          ],
          borderRadius: 4,
          backgroundColor: [
            'rgb(82, 201, 114)',
            'rgb(227, 203, 155)',
            'rgb(255, 115, 115)'
          ],

          barThickness: 5,
          hoverOffset: 4,
        },
      ],
    }
    this.canvas = document.getElementById('activeStatusChart')
    this.ctx = this.canvas?.getContext('2d')
    this.chart = new Chart(this.ctx, {
      type: 'pie',
      data: chartData,
      options: {
        responsive: false,
        cutout: 65,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    })
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.languange = language.lang
      this.createChart()
    })
  }

}
