import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IVotingTemplate } from 'src/app/modules/committees-management/settings/voting/models/votingTemplate/IVotingTemplate';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/app/core/config/api.config';
import { Router } from '@angular/router';
import { RoutesVariables } from 'src/app/modules/committees-management/routes';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';

@Component({
  selector: 'voting-edit-model',
  templateUrl: './voting-edit-model.component.html',
  styleUrls: ['./voting-edit-model.component.scss']
})
export class VotingEditModelComponent implements OnInit {

  language: string = this.translate.currentLang;

  loading: boolean = false;
  isBtnLoading: boolean = false;
  votingTemplate: IVotingTemplate;

  private endSub$ = new Subject();

  form: FormGroup = new FormGroup({});

  // @Input() list = [];
  // @Input() item: any = null;

  @Input() id?: number;


  // @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private modelService: ModelService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();
    this.initFormControls();
    this.checkId();
  }

  // handles language change event
  private handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // edit voting template
  saveVotingTemplate() {
    const body = {
      ...this.form.value,
    };
    if (this.id > 0) {
      body.id = this.id
      this.updateVotingTemplate(body);
    }
    else
      this.createVotingTemplate(body);
  }

  updateVotingTemplate(body: IVotingTemplate) {
    this.httpSer
      .put(Config.VotingTemplate.Update, body)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeVotingTemplates.updateSuccessMsg'));
          this.reset();
        }
      });
  }

  createVotingTemplate(body: IVotingTemplate) {
    this.httpSer
      .post(Config.VotingTemplate.Create, body)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeVotingTemplates.createSuccessMsg'));
          this.reset();
        }
      });
  }

  reset() {
    this.close.emit();
    this.closePopup();
  }
  // close voting edit model
  closePopup() {
    this.modelService.close();
  }

  checkId() {
    if (this.id > 0)
      this.getDetails()
  }

  getDetails() {
    this.httpSer
      .get(`${Config.VotingTemplate.GetById}/${this.id}`)
      .pipe(
        finalize(() => (this.loading = false)))
      .subscribe((res) => {
        if (res) {
          if (res.status == 1) {
            this.router.navigateByUrl(`/committees-management/${RoutesVariables.VotingTemplate.List}`);
          } else {
            this.votingTemplate = res;
            this.form.patchValue(this.votingTemplate);
          }
        } else this.goToNotFound();
      });
  }

  initFormControls() {
    this.form = this.fb.group({
      name: [null, [Validators.required, EnglishLettersAndNumbersWithComma()]],
      nameAr: [null, [Validators.required, ArabicLettersAndNumbersOnly()]]
    });
  }
  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }
}
