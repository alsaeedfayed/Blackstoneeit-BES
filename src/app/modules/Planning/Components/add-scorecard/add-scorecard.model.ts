import { Constant } from 'src/app/core/config/constant';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { PopupService } from './../../../../shared/popup/popup.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { EnglishLettersAndNumbersOnly } from 'src/app/core/helpers/English-Letters-And-Numbers-Only.validator';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { PlanningService } from '../../Page/planning.service';


@Injectable()
export class AddScorecardModel {
  private endSub$ = new Subject()

  public isSubmitted:boolean = false;
  public isBtnLoading:boolean = false;
  public currentYear = new Date().getFullYear()
  public form:FormGroup;
  //constructor
  constructor(private fb:FormBuilder,private popupSer:PopupService,private _http:HttpHandlerService,private toastSer:ToastrService,private translateSer:TranslateService,private planningSer:PlanningService
  ) {
    this.initForm()
    this.checkReset();
  }

  //methods
  private initForm() {
    this.form = this.fb.group({
      title: ["", [Validators.required,EnglishLettersAndNumbersOnly()]],
      titleAr: ["", [Validators.required, ArabicLettersAndNumbersOnly()]],
      description:["",Validators.required],
      excecutionYear: ["", [Validators.required, Validators.min(this.currentYear)]],
      current:[false,Validators.required],
    })
  }

  private checkReset(){
    this.popupSer.reset$.subscribe((res)=>{
      if(res) {
        this.isSubmitted = false
        this.form.reset()
      }
    })
  }

  public onPopupCancel(){
    this.popupSer.close()
  }


  public submit(){
    this.isSubmitted = true;
    if(this.form.invalid) return;
    this.isBtnLoading = true;
    this._http.post(Config.scorecard.create,this.form.value).pipe(finalize(()=>this.isBtnLoading = false),takeUntil(this.endSub$)).subscribe((res)=>{
      this.form.reset()
      this.popupSer.close()
      this.toastSer.success(this.translateSer.currentLang == 'en' ? `Scorecard '${res.title}' Added Suceesfully` : `تمت إضافة ${res.title} بنجاح`)
      localStorage.setItem(Constant.selectedScorecardId,res.id);
      this.planningSer.setNewAddedScorecard(res.id)
    })
  }

  // end subscribtions
  public endSubs() {
    this.endSub$.next('');
    this.endSub$.complete();
  }
}
