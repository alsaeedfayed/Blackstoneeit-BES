import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { Config } from "src/app/core/config/api.config";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";

@Component({
  selector: "app-meetings-attendance-percantage",
  templateUrl: "./meetings-attendance-percantage.component.html",
  styleUrls: ["./meetings-attendance-percantage.component.scss"],
})
export class MeetingsAttendancePercantageComponent implements OnInit {
  //TODO VARIABLE
  @Input() committeeId: number = 0;
  @Input() language: string = '';

  loadingRates: boolean = true;
  attendanceRate: number = 0;
  membersAttendanceRate: any[] = [];

  constructor(
    private httpSer: HttpHandlerService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getAttendanceRate();
  }

  getAttendanceRate() {
    this.httpSer
      .get(`${Config.CommitteeDashboard.GetAttendanceRate}/${this.committeeId}`)
      .pipe(finalize(() => { this.loadingRates = false; }))
      .subscribe(res => {
        if (res) {
          this.attendanceRate = res.attendanceRate;
          this.membersAttendanceRate = res.membersAttendanceRate;
        }
      });
  }
}
