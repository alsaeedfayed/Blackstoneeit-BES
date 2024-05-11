import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import Chart from 'chart.js/auto'

@Component({
  selector: 'app-spent-total-tasks',
  templateUrl: './spent-total-tasks.component.html',
  styleUrls: ['./spent-total-tasks.component.scss']
})
export class SpentTotalTasksComponent implements OnInit , OnDestroy{

  data: any

  reqStatus: any
  shouldShowStatusChart = true

  @ViewChild('spentTotal') spentTotal
  chart: any
  canvas: any
  ctx: any


  @Input('data') set daata(data: any) {
    if(data) {
      this.data = data;
     // console.log('budget data' , data)
      this.createChart()
    }
  }

  constructor(private translateService: TranslateService) { }
  ngOnDestroy(): void {
    this.chart.destroy()
  }

  ngOnInit(): void {
    this.handleLangChange()
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      if (this.data) {

        if (this.chart) this.chart.destroy()
        this.createChart()
      }
    })
  }

    //TODO Actions
    createChart() {
      const chartLabels = [this.translateService.instant('bau.dashboard.spent'),this.translateService.instant('bau.dashboard.total')]

      const chartData = {
        labels: chartLabels,

        datasets: [
          {
            data: [this.data?.spentAmount, this.data?.totalBudget],
            backgroundColor: [ 'rgb(237, 162, 91)','#0066FF'],
            barThickness: 15,
            offset : 2 ,
            hoverOffset: 2,
            borderWidth : 4,
            borderColor : ['rgb(237, 162, 91)' , '#fff']

          },
        ],
      }
      this.canvas = document.getElementById('spentTotal')
      this.ctx = this.canvas?.getContext('2d')
      this.chart = new Chart(this.ctx, {
        type: 'pie',
        data: chartData,

        options: {
          responsive: false,
          cutout: 115,
          radius : 100,


          plugins: {

            legend: {
              display: false,
            },
          },
        },
      })
    }


}
