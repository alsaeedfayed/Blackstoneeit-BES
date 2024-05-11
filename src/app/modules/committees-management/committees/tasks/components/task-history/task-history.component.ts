import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { TaskHistory } from '../../models/TaskHistory';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-task-history',
  templateUrl: './task-history.component.html',
  styleUrls: ['./task-history.component.scss']
})
export class TaskHistoryComponent implements OnInit {

  @Input() language: string = '';
  @Input() taskId: number = 0;
  @Output() onDetails = new EventEmitter<TaskHistory>();

  loading: boolean = true;

  userData = {
    "email": "superadmin@qc.com",
    "userName": "superadmin@qc.com",
    "fullArabicName": null,
    "fileName": "admin_638284714295320422.png",
    "fullFileName": null,
    "id": "74979248-b122-4094-ade8-01a7b5b73cc0",
    "fullName": "super admin",
    "position": "super",
  };

  taskHistory: TaskHistory[] = [];


  constructor(private el: ElementRef,
    private httpSer: HttpHandlerService,) { }

  ngOnInit(): void {
    // get task history
    this.getTaskHistory();
  }
  // go to element 
  goTo(item: TaskHistory) {
    this.onDetails.emit(item);
  }
  getTaskHistory() {
    this.httpSer
      .get(`${Config.Task.GetHistory}/${this.taskId}`)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: TaskHistory[]) => {
        if (res) {
          this.taskHistory = res;
        }
      });
  }


}
