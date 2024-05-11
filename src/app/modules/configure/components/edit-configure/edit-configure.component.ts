import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateService } from '@ngx-translate/core';
import { Config } from 'src/app/core/config/api.config';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-edit-configure',
  templateUrl: './edit-configure.component.html',
  styleUrls: ['./edit-configure.component.scss'],
})

export class EditConfigureComponent implements OnInit {

  @Input() configure: any = null;
  @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  form: FormGroup = new FormGroup({});
  isBtnLoading: boolean = false;
  loading: boolean = false;
  language: string = this.translateService.currentLang;

  monthDays: Array<{ day: number }> = new Array<{ day: number }>();

  constructor(private httpHandlerService: HttpHandlerService, private modelService: ModelService, private fb: FormBuilder, private translateService: TranslateService) { }
  endDate: Date = new Date();

  ngOnInit(): void {
    this.getMonthDays();
    this.handleForm();
    this.handleLangChange();
    this.modelService.closeModel$.subscribe((data) => {
      if (!this.configure) {
        this.form.reset();
      }
    });
  }

  handleForm(): void {
    this.form = this.fb.group({
      startDay: this.fb.control(null),
      duration: this.fb.control(null)
    });
    if (!!this.configure) {
      this.handelOldValue();
    }
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.language = language.lang;
    });
  }

  handelOldValue() {
    const data = {
      startDay: this.configure?.startDay,
      duration: this.configure?.duration,
    };
    this.form.patchValue(data);
    this.calculateEndDate(); 
  }

  closePopup() {
    this.modelService.close();
    if (!this.configure)
      this.form.reset();
  }

  updateConfig() {
    this.isBtnLoading = true;

    const body = {
      ...this.form.value,
      startDay: this.form.value.startDay,
      duration: this.form.value.duration,
      id: this.configure.id,
    };
    this.httpHandlerService
      .put(Config.Configuration.updateConfiguration, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe((res) => {
        this.closePopup();
        this.configure = {
          ...this.configure,
          ...body,
        };
        this.update.emit(this.configure);
      });
  }

  calculateEndDate(){
    let currentYear = new Date().getFullYear();
    let currentMonth = this.configure.number;
    let startDate = new Date(currentYear, currentMonth - 1, this.configure.startDay);
    this.endDate = this.addDays(startDate, this.configure.duration); 
  }

  onChangeStartDay(event: any) {
    let startDay = parseInt(event.day);
    this.configure.startDay = startDay; 
    this.calculateEndDate(); 
  }

  onChangeDuration(event: any) {
    let duration = parseInt(event.day);
    this.configure.duration = duration; 
    this.calculateEndDate(); 
  }

  addDays(date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  getMonthDays() {
    let res: Array<{ day: number }> = new Array<{ day: number }>();
    let currentYear = new Date().getFullYear();

    if (this.configure) {
      let daysCount = new Date(currentYear, this.configure.number , 0).getDate();
      for (let i: number = 1; i <= daysCount; i++)
        res.push({ day: i });
    }

    this.monthDays = res;
  }
}
