import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import { id } from '@swimlane/ngx-charts';
import { ToastrService } from 'ngx-toastr';
import { Subject, combineLatest, from } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { RoutesVariables } from 'src/app/modules/committees-management/routes';
import { ModelService } from 'src/app/shared/components/model/model.service';
@Component({
  selector: 'app-change-request-model',
  templateUrl: './change-request-model.component.html',
  styleUrls: ['./change-request-model.component.scss']
})
export class ChangeRequestModelComponent implements OnInit {

  language: string = this.translate.currentLang;

  @Output() evaluationAdded = new EventEmitter();

  validateDateRang: boolean = false


  private endSub$ = new Subject();

  // loading vars
  isBtnLoading: boolean = false;
  reasons: any = []
  loadingReasons: boolean = false
  committeeId;
  changeRequestForm: FormGroup;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private modelService: ModelService,
    private httpSer: HttpHandlerService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute

  ) {
    this.activatedRoute.params.subscribe(params => {
      this.committeeId = +params['id']

    })
  }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    // initialize form controls
    this.initChngeRequestForm()


  }

  // handles language change event
  private handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  initChngeRequestForm() {
    this.changeRequestForm = this.fb.group({
      description: [null],
      reason: [null, [Validators.required]]

    })
  }



  saveNewChangeRequest() {
    //this.isBtnLoading = true;
    // let body = {
    //   reason: this.changeRequestForm.value.reason,
    //   description: this.changeRequestForm.value.description,
    //
    localStorage.setItem('changeRequestData', JSON.stringify(this.changeRequestForm.value))
    this.router.navigateByUrl(`committees-management/modify-request/${this.committeeId}`);

  }

  closePopup() {
    this.changeRequestForm.reset();
    this.modelService.close();

  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }



}
