import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';
import { committeesCategoriesObject } from '../../models/committees-dashboard';
@Component({
  selector: 'app-committee-categories',
  templateUrl: './committee-categories.component.html',
  styleUrls: ['./committee-categories.component.scss']
})
export class CommitteeCategoriesComponent implements OnInit, AfterViewInit {

  @ViewChild('myChart') myChart
  chart: any
  canvas: any
  ctx: any
  data: any
  chartLables: string[] = []
  chartData: string[] = []
  backgroundColorsArr: string[] = [
    '#015bff', '#ff7373', '#dae0e8', '#6d99e9', '#52c972', '#95a6d7', '#e3cb9b', '#e3b1b1', '#b3d7bd', '#ddc8c8',
  ]
  backgroundColors: string[] = []
  languange: string = this.translateService.currentLang


  @Input('data') set daata(data: any) {

    if (data) {
      this.data = data
      //createChat
      this.setChartData()
      if (this.chart) this.chart.destroy()
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
    const chartLabels = this.chartLables

    const chartData = {
      labels: [...chartLabels],
      datasets: [
        {
          data: this.chartData,
          borderRadius: 4,
          backgroundColor: this.backgroundColors,
          barThickness: 5,
          hoverOffset: 4,
        },
      ],
    }
    this.canvas = document.getElementById('myChart2')
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

  setChartData(): void {
    this.chartData = []
    this.chartLables = []
    this.data?.date.forEach((item, i) => {
      this.chartLables.push(this.languange === "en" ? item?.categoryName : item?.categoryNameAr)
      this.chartData.push(item?.totalCommittees)
      this.backgroundColors.push(this.backgroundColorsArr[i])

    });
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.languange = language.lang
      this.setChartData()
      if (this.chart) this.chart.destroy()
      this.createChart()
    })
  }


}
