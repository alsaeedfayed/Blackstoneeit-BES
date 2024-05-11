import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard-tasks-progress',
  templateUrl: './dashboard-tasks-progress.component.html',
  styleUrls: ['./dashboard-tasks-progress.component.scss']
})
export class DashboardTasksProgressComponent implements OnInit {
  @ViewChild('myChart') myChart: any
  data = {
    labels: ["Zakaria", "Ahmed", "Salim", "Karim", "Oussama", "Mouhcine"],
    datasets: [
      {
        label: "Zakaria",
        backgroundColor: "#3C557A",
        data: [20, 100],
        borderRadius: 5,
        barThickness: 10,
        barPercentage: 1.0,
        categoryPercentage: 0.8, // notice here 

      },
      {
        label: "Ahmed",
        backgroundColor: "#00DB99",
        data: [50, 40],
        borderRadius: 5,
        barThickness: 10,
        barPercentage: 1.0,

      },
    ]
  };
  canvas: any;
  ctx: any;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.canvas = this.myChart.nativeElement
    this.ctx = this.canvas.getContext('2d')

    new Chart(this.ctx, {
      type: 'bar',
      data: this.data,
      options: {
        plugins: {
          legend: { display: false }
        },

      }
    } as any);
  }

}
