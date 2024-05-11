import { Component, OnInit, ApplicationRef } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TranslateConfigService } from "src/app/core/services/translate-config.service";
import { ComponentBase } from "src/app/core/helpers/component-base.directive";
import { ActivatedRoute } from "@angular/router";
import { EventRegistrationService } from "../../services/event-registration.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LookupService } from "src/app/core/services/lookup.service";
import { ToastrService } from "ngx-toastr";
import { take, takeUntil } from "rxjs/operators";
import { ReplaySubject, Subject, of } from "rxjs";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { CompressImageService } from "src/app/shared/services/compress-image.service";
import moment from "moment";
import { RegexConfig } from "src/app/core/config/regex.configs";

@Component({
  selector: "app-event-registration-main",
  templateUrl: "./event-registration-main.component.html",
  styleUrls: ["./event-registration-main.component.scss"],
})

export class EventRegistrationMainComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();
  lang: string;

  event: any;
  hasEventReachedDeadline: boolean;
  form: FormGroup;
  isFormSubmitted: boolean;
  selectedImg: { title: any; data: any };
  imgUrl: string | ArrayBuffer;
  logo$: ReplaySubject<SafeResourceUrl> = new ReplaySubject(1);
  mode: string = "form";
  personTitles: any;
  entitiesList: any;
  ageGroups: any;
  isBtnLoading: boolean;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private sanitizer: DomSanitizer,
    private eventRegistrationService: EventRegistrationService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private lookupService: LookupService,
    private route: ActivatedRoute,
    private compressImage: CompressImageService,
    private ref: ApplicationRef,
  ) {
    super(translateService, translate);
  }

  ngOnInit() {

    // handles language change event
    this.handleLangChange();

    this.getEventById(this.route.snapshot.params["id"]);

    this.initRegistrationForm();

    this.logo$.next(
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "data:image/png;base64, " +
        JSON.parse(localStorage.getItem("settings"))?.find(o => o.key === "Logo").value
      )
    );
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.lang = this.translate.currentLang;
      });
  }

  getEntitiesList() {
    // this.lookupService.getEntities().subscribe(res => {
    //   this.entitiesList = res;
    // });
  }

  getEventById(id) {
    this.eventRegistrationService.getEventById(id)
      .subscribe(res => {
        this.event = res;

        if (new Date().getTime() <= new Date(res.registrationDeadline).getTime()) {
          this.initRegistrationForm();
          this.getEntitiesList();
        } else {
          this.mode = "empty-state";
        }
      });
  }

  getPersonTitles() {
    // this.lookupService.getPersonTitles().subscribe(res => {
    //   this.personTitles = res;
    // });
  }

  getAgeGroups() {
    // this.lookupService.getAgeGroups().subscribe(res => {
    //   this.ageGroups = res;
    // });
  }

  initRegistrationForm() {
    this.form = this.fb.group({
      fullName: [null, Validators.required],
      title: [null, Validators.required],
      email: [null, [Validators.required, Validators.pattern(RegexConfig.emailRegExp)]],
      phoneNumber: [null, Validators.required],
      // entity: [null, Validators.required],
      profilePicture: [null],
    });
  }

  get getRegistrationForm() {
    return this.form.controls;
  }

  convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((<string>reader.result)?.split(",")[1]);
      reader.onerror = error => reject(error);
    });
  }

  onRegistrationSubmit() {
    this.isFormSubmitted = true;

    if (this.form.valid) {
      this.isBtnLoading = true;

      if (this.selectedImg?.data) {
        this.convertFileToBase64(this.selectedImg.data).then(res => {
          const formValue = {
            eventId: this.event.id,
            title: this.form.value.title,
            fullName: this.form.value.fullName,
            email: this.form.value.email,
            phoneNumber: this.formatPhoneNumber(
              this.form.value.phoneNumber
            ),
            // "entity": this.registrationForm.value.entity,
            picture: {
              title: this.selectedImg.title,
              data: res,
            },
          };
          this.eventRegistrationService.register(formValue).subscribe(
            res => {
              this.form.reset();
              this.mode = "success-state";
              this.isBtnLoading = false;
            },
            err => {
              this.isBtnLoading = true;
              this.toastr.error(err.message);
            }
          );
        });
      } else {
        const formValue = {
          eventId: this.event.id,
          title: this.form.value.title,
          fullName: this.form.value.fullName,
          email: this.form.value.email,
          phoneNumber: this.formatPhoneNumber(
            this.form.value.phoneNumber
          ),
          // "entity": this.registrationForm.value.entity,
          picture: null,
        };
        this.eventRegistrationService.register(formValue).subscribe(
          res => {
            this.form.reset();
            this.mode = "success-state";
            this.isBtnLoading = false;
          },
          err => {
            this.isBtnLoading = true;
            this.toastr.error(err.message);
          }
        );
      }
    }
  }

  formatPhoneNumber(number) {
    const numberWithoutSpaces = number.replace(/\s/g, "");
    const numberWithoutPlus = numberWithoutSpaces.replace("+", "");
    const formattedNumber = numberWithoutPlus.replace("-", "");

    return formattedNumber;
  }

  onProfileImageChoose(e) {
    this.selectedImg = {
      title: e.target.files[0].name,
      data: e.target.files[0],
    };

    let reader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];

      this.compressImage
        .compress(file)
        .pipe(take(1))
        .subscribe(compressedImage => {
          reader.readAsDataURL(compressedImage);
          reader.onload = res => {
            this.imgUrl = reader.result;
            this.ref.tick();
          };
        });
    }
  }
}
