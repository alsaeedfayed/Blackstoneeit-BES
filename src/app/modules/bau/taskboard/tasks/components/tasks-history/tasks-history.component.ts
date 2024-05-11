import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Component({
  selector: 'app-tasks-history',
  templateUrl: './tasks-history.component.html',
  styleUrls: ['./tasks-history.component.scss']
})
export class TasksHistoryComponent implements OnInit {

  @Input() language: string = '';
  @Input() taskId: number = 0;
  @Output() onDetails = new EventEmitter<any>();

  loading: boolean = true;

  taskHistory: any[] = [];


  constructor(private el: ElementRef,
    private httpSer: HttpHandlerService,) { }

  ngOnInit(): void {
    // get task history
    this.getTaskHistory();
  }
  // go to element
  goTo(item: any) {
    this.onDetails.emit(item);
  }
  getTaskHistory() {
    this.httpSer
      .get(`${Config.BAU.Tasks.getHistory}/${this.taskId}`)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any[]) => {
        if (res) {
          this.taskHistory = res;
          // TODO remove it after fix the user card
          this.taskHistory.map((task) => {
            if (task.creatorInfo)
              task.creatorInfo = {
                ...task.creatorInfo,
                fullArabicName: task.creatorInfo.fullName
              }
          });
        }
      });
  }


}
