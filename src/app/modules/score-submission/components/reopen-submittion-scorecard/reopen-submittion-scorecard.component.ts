import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ModelService } from "src/app/shared/components/model/model.service";

@Component({
    selector: 'reopen-submittion-scorecard',
    templateUrl: './reopen-submittion-scorecard.component.html',
    styleUrls: ['./reopen-submittion-scorecard.component.scss'],
})

export class ReopenScorecardSubmissionComponent {

    form: FormGroup = new FormGroup({});
    language: string = this.translateService.currentLang;

    @Output() save: EventEmitter<any> = new EventEmitter();
    @Output() close: EventEmitter<any> = new EventEmitter();
  
    constructor(
      private fb: FormBuilder,
      private modelService: ModelService,
      private translateService: TranslateService
    ) {
      this.initForm();
    }
  
    ngOnInit(): void {
      // this.getUsers();
      this.handleLangChange();
      this.modelService.closeModel$.subscribe((data) => {
        this.form.reset();
      });
    }
  
    handleLangChange() {
      this.translateService.onLangChange.subscribe((language) => {
        this.language = language.lang;
      });
    }
  
    initForm(): void {
      this.form = this.fb.group({
        reason: this.fb.control('', Validators.required),
      });
    }
    
    saveReason() {
      if (this.form.invalid) return;

        const data = this.form.value;
        const body = {
            ...data,
        };
        this.form.reset();
        this.save.emit({ ...body });
        this.closePopup();
    }

    closePopup() {
        this.modelService.close();
        this.form.reset();
    }

}