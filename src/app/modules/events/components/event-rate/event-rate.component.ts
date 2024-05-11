import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from 'src/app/core/services/translate.service';
import { EventsService } from '../../services/events.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { ReplaySubject, of } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-event-rate',
  templateUrl: './event-rate.component.html',
  styleUrls: ['./event-rate.component.scss']
})
export class EventRateComponent implements OnInit {

  logo$: ReplaySubject<SafeResourceUrl> = new ReplaySubject(1);
  rateForm: FormGroup;
  isBtnLoading: boolean = false;
  eventId;
  AttendeeCode;
  event;
  mode = "form";


  constructor(private translationService: TranslationService,
    private eventsService: EventsService,
    private toastr: ToastrService,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.rateForm = this.fb.group({
      rate: [null, [Validators.required]],
    })
    this.eventId = this.route.snapshot.params['eventId'];
    this.AttendeeCode = this.route.snapshot.params['AttendeeCode'];
    this.eventsService.closeRatingEvent(this.AttendeeCode).subscribe(data=>{
      if(data == false){
        this.mode="empty-state";
      }
    })
    this.getEventById(this.eventId);
    this.logo$.next(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + JSON.parse(localStorage.getItem('settings')).find(o => o.key === 'Logo').value));
  }

  getEventById(id){
    this.eventsService.getEventById(id).subscribe(res => {
      this.event = res;
    })
  }

  setRate(number){
    this.rateForm.controls["rate"].setValue(number);
  }


  rate() {
    if(this.rateForm.valid){
      this.eventsService.rateEvent({
        attendeeCode : this.AttendeeCode,
        rateValue : this.rateForm.get("rate").value
      }).subscribe(res => {
        this.mode = 'success-state';
        // this.toastr.success("Event was successfully rated");
      }, err => {
        this.toastr.error(err.message.en)
      })
    }else{
      this.toastr.error("Rate is required");
    }
  }

}
