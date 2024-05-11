import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import Gantt from 'frappe-gantt-extended';
import moment from 'moment';

@Component({
  selector: 'app-projects-planning-gantt',
  templateUrl: './projects-planning-gantt.component.html',
  styleUrls: ['./projects-planning-gantt.component.scss']
})
export class ProjectsPlanningGanttComponent implements OnInit, OnChanges {

  @ViewChild('gantt') ganttEl: ElementRef;
  @Input() projectData
  gantt;
  tasks: any = [
    // {
    //   id: 'Milestone 1',
    //   name: 'Milestone 1',
    //   start: '2016-01-28',
    //   end: '2016-02-31',
    //   progress: 80,
    // },
    // {
    //   id: 'Milestone 1',
    //   name: 'Milestone 1',
    //   start: '2016-04-28',
    //   end: '2016-07-31',
    //   progress: 80,
    // },
    // {
    //   id: 'Milestone 1',
    //   name: 'Milestone 1',
    //   start: '2016-10-28',
    //   end: '2016-12-31',
    //   progress: 80,
    // },
    // {
    //   id: 'Milestone 1',
    //   name: 'Milestone 1',
    //   start: '2016-01-28',
    //   end: '2016-02-31',
    //   progress: 80,
    // },
    // {
    //   id: 'Milestone 1',
    //   name: 'Milestone 1',
    //   start: '2016-04-28',
    //   end: '2016-07-31',
    //   progress: 80,
    // },
    // {
    //   id: 'Milestone 1',
    //   name: 'Milestone 1',
    //   start: '2016-10-28',
    //   end: '2016-12-31',
    //   progress: 80,
    // },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.projectData?.currentValue) {
      this.projectData.milestones.forEach(milestone => {
        this.tasks.push({
          id: milestone.id.toString(),
          name: milestone.name.en,
          start: new Date(this.projectData.startDate),
          end: new Date(milestone.dueDate),
          progress: milestone.progress,
        })
      });
    }
  }

  ngOnInit() {
    this.gantt = new Gantt('#gantt', this.tasks, {
      header_height: 60,
      column_width: 30,
      step: 24,
      view_modes: ['Day', 'Week', 'Month'],
      bar_height: 20,
      bar_corner_radius: 3,
      arrow_curve: 5,
      padding: 18,
      view_mode: 'Month',
      date_format: 'YYYY-MM-DD',
      custom_popup_html: null,
      draggable: false,
      hasArrows: false,
    });
  }

  onChangeView(mode) {
    this.gantt.change_view_mode(mode)
  }


}
