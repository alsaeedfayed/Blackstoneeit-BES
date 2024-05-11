import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { EventsService } from '../../services/events.service';
import { StatisticsService } from '../../services/statistics-service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { ChartData, ChartType, ChartDataset, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ApexCharts from 'apexcharts';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  lang: string = this.translate.currentLang;

  event: any;
  query;
  confirmationPopupText: string = this.translate.instant('events.details.deleteEventConfirmMsg');
  btnContent: string = "Delete"
  confirmationMode: string;
  attendeeToDeleteId: any;
  isShowMore: boolean = false;

  // Pie Chart
  public pieChartType: ChartType = 'pie'
  public pieChartLabels: string[] = ['Attended', 'Not Attended'];
  public pieChartData: ChartData<'bar'> = {
    labels: this.pieChartLabels,
    datasets: [
      {
        label: "Invitees",
        data: [],
        backgroundColor: ["#de752e", "#406bb8"],
        hoverBackgroundColor: ["#de752e", "#406bb8"],
      }
    ]
  };

  // Bar Chart
  public barChartData;

  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;
  @ViewChild("barChart") chartEle: ElementRef;

  deleteLabel = this.translate.instant('shared.delete');

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private eventsService: EventsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private statisticsService: StatisticsService,
  ) {
    super(translateService, translate);
  }

  ngOnInit() {
  
    // handles language change event
    this.handleLangChange();

    // get event data
    this.getEventById(this.route.snapshot.params['id']);

    this.getStatistics();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.lang = this.translate.currentLang;

        this.deleteLabel = this.translate.instant('shared.delete');
      });
  }

  getStatistics() {
    this.statisticsService.getStatistics(this.route.snapshot.params['id'])
      .subscribe(data => {
        this.barChartData = data.satisfactions;
        this.pieChartData.datasets[0].data = [data.attendeedNumber , data.registeredNumber - data.attendeedNumber];

        if (this.charts && this.charts.first) {
          this.charts.first.chart.data = this.pieChartData;
          this.charts.first.chart.update();
        }
      });
  }

  getTime(date: string) {
    let time = (date?.split("T")[1]?.split("+")[0]).split(":");
    let hours = Number(time[0]);
    let mode = hours < 12 ? "AM" : "PM";
    let minutes = Number(time[1]);
    hours = (hours > 12) ? hours - 12 : hours;
    return hours+":"+minutes+" "+mode;
  }

  getEventById(id) {
    this.eventsService.getEventById(id)
      .subscribe(res => {
        res['hasEventRegistrationEnded'] = !moment(res.registrationDeadline).isBefore();
        this.event = res;
      });
  }

  get CanUpdate() {
    return this.event?.status == "Open";
  }

  formatDate(date) {
    date = new Date(date);
    const formattedDate = `${date?.getFullYear()}-${date?.getMonth()}-${date?.getDate()}`;
    return moment(formattedDate, 'YYYY-MM-DD').format();
  }

  onUpdateEvent() {
    this.router.navigateByUrl(`events/edit/${this.route.snapshot.params['id']}`);
  }

  onCancelEventConfirmed(id) {
    this.eventsService.cancelEvent(id).subscribe(res => {
      this.router.navigateByUrl("/events");
      this.toastr.success(this.translate.instant('events.details.cancelEventSuccessMsg'));
    }, err => {
      this.toastr.error(err.message.en);
    })
  }

  openQRCodePopup() {
    $('#QRCodeModalCenter').modal('show');
    this.confirmationPopupText = this.translate.instant('events.details.qrCodeConfirmMsg');
  }

  onDeleteEventConfirmed(id) {
    this.eventsService.deleteEvent(id).subscribe(res => {
      this.router.navigateByUrl("/events");
      this.toastr.success(this.translate.instant('events.details.deleteEventSuccessMsg'));
    }, err => {
      this.toastr.error(err.message.en);
    })
  }

  onCancelEvent(id) {
    $('#basicModalCenter').modal('show');
    this.confirmationPopupText = this.translate.instant('events.details.cancelEventConfirmMsg');
    this.confirmationMode = "Cancel";
    this.btnContent = "Confirm";
  }

  onDeleteEvent(id) {
    $('#basicModalCenter').modal('show');
    this.confirmationPopupText = this.translate.instant('events.details.deleteEventConfirmMsg');
    this.confirmationMode = "Event";
    this.btnContent = "Delete";
  }

  onExport(format) {
    let formattedData = [];

    this.event.attendees.forEach(element => {
      formattedData.push({
        "FULLNAME": element.fullName,
        "POSITION": element.title,
        "REGISTRATION DATE": this.datePipe.transform(
          element.createdDate,
          'yyyy/M/dd h:mm:ss a'
        ),
        "EMAIL": element.email,
        "PHONE": element.phoneNumber,
        // "ENTITY": element.entity,
        "STATUS": element.isCheckedIn ? "Checked In" : "Pending",
        "PROFILE PICTURE LINK": element.picture?.url,
      });
    });

    const workBook = XLSX.utils.book_new(); // create a new blank book
    const workSheet = XLSX.utils.json_to_sheet(formattedData);

    XLSX.utils.book_append_sheet(workBook, workSheet, 'data'); // add the worksheet to the book
    XLSX.writeFile(workBook, `attendees.${format}`);
  }

  onSearchAttendees(keyword: string) {
    this.query = keyword;
  }

  getItems(item): any[] {
    const options = [];

    options.push({
      item: this.deleteLabel,
      icon: 'bx bx-trash-alt',
    })

    return options;
  }

  onAttendeeDeleteConfirmed(id) {
    this.eventsService.deleteAttendee(id).subscribe(res => {
      this.toastr.success(this.translate.instant('events.details.deleteAttendeeSuccessMsg'));
      this.getEventById(this.route.snapshot.params['id']);
    }, err => {
      this.toastr.error(err.message);
    });
  }

  onAttendeeDropdownSelect(e, attendeeId) {
    if (e === "Delete") {
      $('#basicModalCenter').modal('show');
      this.confirmationPopupText = this.translate.instant('events.details.deleteAttendeeConfirmMsg');
      this.confirmationMode = "Attendee";
      this.attendeeToDeleteId = attendeeId;
    }
  }

  onConfirmation() {
    if (this.confirmationMode === "Attendee") {
      this.onAttendeeDeleteConfirmed(this.attendeeToDeleteId);
    }
    if (this.confirmationMode === "Event") {
      this.onDeleteEventConfirmed(this.event.id);
    }
    if (this.confirmationMode === "Cancel") {
      this.onCancelEventConfirmed(this.event.id);
    }
  }

}
