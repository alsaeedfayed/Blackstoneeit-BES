import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormArray, FormGroup, Validators } from "@angular/forms";
import { EventsService } from "../../services/events.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { EnglishLettersAndNumbersWithComma } from "src/app/core/helpers/Emglish-letters-Numbers-Comma";
import { ArabicLettersAndNumbersOnly } from "src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator";
import { TranslateService } from "@ngx-translate/core";
import { TranslateConfigService } from "src/app/core/services/translate-config.service";
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { finalize, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { IAttachmentFile } from "src/app/design-system/components/uploaded-attachments-files/iAttachmentFile";
import moment from "moment";

@Component({
  selector: "app-events-new",
  templateUrl: "./events-new.component.html",
  styleUrls: ["./events-new.component.scss"],
})
export class EventsNewComponent extends ComponentBase implements OnInit {

  event;

  private endSub$ = new Subject();
  lang: string;

  isLoading;
  isBtnLoading: boolean;

  form: FormGroup;
  selectedImg;
  imgUrl: string | ArrayBuffer;
  eventId = null;
  createdDateEvent = null;
  initialValue;
  documentsMaxSize: number = 2;
  documentsFiles: IAttachmentFile[] = [];

  supportedDocumentsTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private fb: FormBuilder,
    private eventsService: EventsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super(translateService, translate);
  }

  minDate(): Date {
    if (this.eventId) {
      return new Date(this.createdDateEvent);
    }
    return new Date();
  }

  ngOnInit() {

    // handles language change event
    this.handleLangChange();

    this.initForm();

    this.getEventById(this.route.snapshot.params['id']);

  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.lang = this.translate.currentLang;
      });
  }

  getEventById(id) {
    if (!id) { return; }

    this.eventsService.getEventById(id)
      .subscribe(res => {
        res['hasEventRegistrationEnded'] = !moment(res.registrationDeadline).isBefore();
        this.event = res;
        this.initEventForm();
      });
  }

  // back to last page
  backToLastPage() {
    if (!!this.event) {

      // go to details page
      this.goToDetailsPage();
    } else {

      // go to events page
      this.router.navigateByUrl('events');
    }
  }

  // go to details page
  goToDetailsPage(id?) {
    const eventId = id || this.event?.id;
    this.router.navigateByUrl(`events/${eventId}`);
  }

  initForm() {

    this.form = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(250), EnglishLettersAndNumbersWithComma()]],
      arabicTitle: [null, [Validators.required, Validators.maxLength(250), ArabicLettersAndNumbersOnly()]],
      description: [null],
      documents: this.fb.array([]),
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      registrationDeadline: [null, Validators.required],
      location: [null, [Validators.required, EnglishLettersAndNumbersWithComma()]],
      locationAr: [null, [Validators.required, ArabicLettersAndNumbersOnly()]],
      coverPhoto: [null],
      agenda: this.fb.array([]),
    });
  }

  async initEventForm() {
    this.eventId = this.event?.id;
    this.createdDateEvent = this.event?.createdDate;
   // debugger
    if (!!this.event) {
     // debugger
      this.form.get("title").setValue(this.event.title);
      this.form.get("arabicTitle").setValue(this.event.titleAr);
      this.form.get("description").setValue(this.event.description);
      this.form.get("startDate").setValue(this.event.startDate?.split("T")[0]);
      this.form.get("endDate").setValue(this.event.endDate?.split("T")[0]);
      this.form.get("startTime").setValue(this.event.startDate?.split("T")[1]?.split("+")[0]);
      this.form.get("endTime").setValue(this.event.endDate?.split("T")[1]?.split("+")[0]);
      this.form.get("registrationDeadline").setValue(this.event.registrationDeadline?.split("T")[0]);
      this.form.get("location").setValue(this.event.location);
      this.form.get("locationAr").setValue(this.event.locationAr);

      for (let index = 0; index < this.event.attachments.length; index++) {
        const attachment = this.event.attachments[index];

        this.documents.push(
          this.fb.group({
            title: attachment?.title,
            data: ((await this.download(attachment?.url)) as string)?.split(",")[1],
            url: attachment?.url,
          })
        );
      }

      if (this.event.agenda?.length !== 0 && this.event.agenda) {
        this.event.agenda.forEach(element => {
          this.agendas.push(
            this.fb.group({
              arabic: element.ar,
              english: element.en,
            })
          );
        });
      } else {
        this.agendas.push(this.newAgenda());
      }

      this.form.controls.coverPhoto?.setValidators([]);
      this.imgUrl = this.event.coverPhoto?.url;
      this.selectedImg = this.event.coverPhoto;
    } else {
      this.form.controls.coverPhoto.setValidators([Validators.required]);
      this.agendas.push(this.newAgenda());
    }

    this.initialValue = this.form.value;
  }

  get agendas(): FormArray {
    return this.form.get("agenda") as FormArray;
  }

  async download(url) {
    return fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise(callback => {
            let reader = new FileReader();
            reader.onload = function () {
              callback(this.result);
            };
            reader.readAsDataURL(blob);
          })
      );
  }

  get documents(): FormArray {
    return this.form.get("documents") as FormArray;
  }

  newDocument(): FormGroup {
    return this.fb.group({
      title: null,
      data: null,
    });
  }

  newAgenda(): FormGroup {
    return this.fb.group({
      english: [null, [EnglishLettersAndNumbersWithComma()]],
      arabic: [null, [ArabicLettersAndNumbersOnly()]],
    });
  }

  get getEventsForm() {
    return this.form.controls;
  }

  onAddAgendaItem() {
    this.agendas.push(this.newAgenda());
  }

  onAddAttachmentItem() {
    this.documents.push(this.newDocument());
  }

  onRemoveAttachmentItem(i) {
    this.documents.removeAt(i);
    this.documentsFiles.splice(i, 1);

    this.toastr.success(this.translate.instant('shared.removed'));
  }

  onRemoveAgendaItem(index: number) {
    if (this.agendas.controls.length == 1) { return; }
    this.agendas.removeAt(index);
  }

  async onAttachmentChange(e) {
    const files: FileList | null = e.target.files;

    if (files?.length > 0) {
      if (this.validateFileSize(files[0]) && this.validateFileType(files[0])) {

        // check for duplicated file
        if (this.documentsFiles.filter((item) => files[0].name === item.fileName).length === 0) {
          this.onAddAttachmentItem();

          (this.documents.controls[this.documents.controls.length - 1] as FormGroup)
            .controls.title.setValue(e.target.files[0].name);

          (this.documents.controls[this.documents.controls.length - 1] as FormGroup)
            .controls.data.setValue(await this.convertFileToBase64(e.target.files[0]));

          this.documentsFiles.push({
            file: e.target.files[0],
            fileName: e.target.files[0].name,
            size: e.target.files[0].size,
            extension: e.target.files[0].name.split('.').pop(),
          });

        } else {
          this.toastr.error(this.translate.instant('shared.validations.fileAlreadyUploaded'));
        }
      }
    }
  }

  private validateFileSize(file: File): boolean {
    if (file.size < this.documentsMaxSize * 1024 * 1024) {
      return true;
    }
    this.toastr.error(this.translate.instant('shared.fileSizeErrMsg'));
    return false;
  }

  private validateFileType(file: File) {
    if (this.supportedDocumentsTypes.includes(file.type)) {
      return true;
    }
    this.toastr.error(this.translate.instant('shared.fileTypeErrMsg'));
    return false;
  }

  onFileChange(e) {
    this.selectedImg = {
      title: e.target.files[0].name,
      data: e.target.files[0],
    };

    let reader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imgUrl = reader.result;
      };
    }
  }

  convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((<string>reader.result)?.split(",")[1]);
      reader.onerror = error => reject(error);
    });
  }

  isValidDates() {
    const today = new Date();

    if (this.createdDateEvent) {
      if (
        !this.form.controls["startDate"].value ||
        new Date(this.form.controls["startDate"].value.toISOString()?.split("T")[0]).getTime() < new Date(this.createdDateEvent?.split("T")[0]).getTime()
      ) {
        if (this.form.controls["startDate"].value) {
          this.toastr.error(this.translate.instant('events.datesValidation.startBeforeCreation'));
        }
        return false;
      }

      if (
        !this.form.controls["endDate"].value ||
        new Date(this.form.controls["endDate"].value.toISOString()?.split("T")[0]).getTime() < new Date(this.createdDateEvent?.split("T")[0]).getTime()
      ) {
        if (this.form.controls["endDate"].value) {
          this.toastr.error(this.translate.instant('events.datesValidation.endBeforeCreation'));
        }
        return false;
      }

      if (
        !this.form.controls["registrationDeadline"].value ||
        new Date(this.form.controls["registrationDeadline"].value.toISOString()?.split("T")[0]).getTime() < new Date(this.createdDateEvent?.split("T")[0]).getTime()
      ) {
        if (this.form.controls["registrationDeadline"].value) {
          this.toastr.error(this.translate.instant('events.datesValidation.registrationDeadlineBeforeCreation'));
        }
        return false;
      }
    } else {
      if (
        !this.form.controls["startDate"].value ||
        new Date(this.form.controls["startDate"].value.toISOString()?.split("T")[0] + "T" + this.form.controls["startTime"].value).getTime() < today.getTime()
      ) {
        if (this.form.controls["startDate"].value) {
          this.toastr.error(this.translate.instant('events.datesValidation.startBeforeCreation'));
        }
        return false;
      }

      if (
        !this.form.controls["endDate"].value ||
        new Date(this.form.controls["endDate"].value.toISOString()?.split("T")[0] + "T" + this.form.controls["endTime"].value).getTime() < today.getTime()
      ) {
        if (this.form.controls["endDate"].value) {
          this.toastr.error(this.translate.instant('events.datesValidation.endBeforeCreation'));
        }
        return false;
      }
      today.setHours(0, 0, 0, 0);

      if (
        !this.form.controls["registrationDeadline"].value ||
        new Date(this.form.controls["registrationDeadline"].value.toISOString()?.split("T")[0] + "T" + this.form.controls["endTime"].value).getTime() < today.getTime()
      ) {
        if (this.form.controls["registrationDeadline"].value) {
          this.toastr.error(this.translate.instant('events.datesValidation.registrationDeadlineBeforeCreation'));
        }
        return false;
      }
    }

    if (
      new Date(this.form.controls["startDate"].value.toISOString()?.split("T")[0]).getTime() >
      new Date(this.form.controls["endDate"].value.toISOString()?.split("T")[0]).getTime()
    ) {
      this.toastr.error(this.translate.instant('events.datesValidation.endBeforeStart'));
      return false;
    }

    if (
      new Date(this.form.controls["registrationDeadline"].value.toISOString()?.split("T")[0]).getTime() >
      new Date(this.form.controls["endDate"].value.toISOString()?.split("T")[0]).getTime() &&
      new Date(this.form.controls["registrationDeadline"].value.toISOString()?.split("T")[0]).getTime() <
      new Date(this.form.controls["startDate"].value.toISOString()?.split("T")[0]).getTime()
    ) {
      this.toastr.error(this.translate.instant('events.datesValidation.registrationDeadlineAfterEnd'));
      return false;
    }
    return true;
  }

  async onSubmitEvent() {
    if (JSON.stringify(this.initialValue) == JSON.stringify(this.form.value)) {
      this.toastr.error(this.translate.instant('events.form.updateSameDataErrorMsg'));
      return;
    }

    if (this.form.valid && this.isValidDates()) {
      this.isBtnLoading = true;

      let image;
      if (this.selectedImg?.data) {
        image = await this.convertFileToBase64(this.selectedImg?.data);
      }

      let newEvent = {
        title: this.form.value.title,
        titleAr: this.form.value.arabicTitle,
        description: this.form.value.description,
        startDate: this.form.value.startDate.toISOString()?.split("T")[0] + "T" + this.form.value.startTime.toISOString()?.split("T")[1],
        endDate: this.form.value.endDate.toISOString()?.split("T")[0] + "T" + this.form.value.endTime.toISOString()?.split("T")[1],
        registrationDeadline: this.form.value.registrationDeadline.toISOString()?.split("T")[0] + "T" + this.form.value.endTime.toISOString()?.split("T")[1],
        location: this.form.value.location,
        locationAr: this.form.value.locationAr,
        coverPhoto: this.selectedImg ? { data: image, title: this.selectedImg?.title, } : null,
        agenda:
          this.form?.value?.agenda[0]?.arabic ||
          this.form?.value?.agenda[0]?.english
            ? this.form.value.agenda.map(item => ({ ar: item.arabic, en: item.english }))
            : null,
        attachment: (this.documents.controls[0] as FormGroup)?.controls.data
          ? this.documents.controls.map((item: FormGroup) => {
              return {
                title: item.controls.title.value,
                data: item.controls.data.value,
              };
            })
          : null,
      };

      if (this.eventId) {
        newEvent["id"] = this.eventId;
      }

      this.eventsService.addEvent(newEvent)
        .pipe(finalize(() => (this.isBtnLoading = false)))
        .subscribe(res => {
          this.toastr.success(
            this.translate.instant(
              this.eventId ?
              "events.form.eventSuccessfullyUpdated" :
              "events.form.eventSuccessfullyCreated"
            )
          );
          this.form.reset();

          // go to details page
          this.goToDetailsPage(res?.id);
        }, err => {
          this.toastr.error(err.message[this.lang]);
          this.isBtnLoading = false;
        }
      );
    }
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date);
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

  formatDate(date) {
    const formattedDate = `${date?.year}-${date?.month}-${date?.day}`;
    return moment(formattedDate, "YYYY-MM-DD").format();
  }
}
