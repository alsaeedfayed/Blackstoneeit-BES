import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  reports = [
    { title: 'Yearly Performance Report' },
    { title: 'Department  Performance' },
    { title: 'Performance per Perspective ' },

    { title: 'Performance per Pillar' },
    { title: 'Program Performance' },

  ];

  constructor() {}

  ngOnInit(): void {}
}
