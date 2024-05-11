import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';
import { committeesTypes } from '../../models/committees-dashboard';

@Component({
  selector: 'app-committee-types',
  templateUrl: './committee-types.component.html',
  styleUrls: ['./committee-types.component.scss']
})
export class CommitteeTypesComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('myChart') myChart
  chart: any
  canvas: any
  ctx: any
  data: committeesTypes
  languange: string = this.translateService.currentLang


  @Input('data') set daata(data: committeesTypes) {
    if (data.total) {
      this.data = data
      //createChat
      this.createChart()
    }
  }
  constructor(
    private translateService: TranslateService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {

  }
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
      this.translateService.instant('committeeDashboard.dashboard.temporary'),
      this.translateService.instant('committeeDashboard.dashboard.permenant'),
    ]
    const chartData = {
      labels: [...chartLabels],
      datasets: [
        {
          data: [
            this.data?.permanentCount,
            this.data?.temporaryCount,
          ],
          borderRadius: 4,
          backgroundColor: [
            '#DAE0E8',
            '#015BFF'
          ],

          barThickness: 5,
          hoverOffset: 4,
        },
      ],
    }
    this.canvas = document.getElementById('myChart')
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
