import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';



@Component({
  selector: 'app-weight-settins',
  templateUrl: './weight-settins.component.html',
  styleUrls: ['./weight-settins.component.scss']
})
export class WeightSettinsComponent implements OnInit {

  //Loading
  isLoading: boolean = true
  loaderSave : boolean = false
  disableFields : boolean = false

  form: FormGroup = new FormGroup({});

  constructor(private translate: TranslateService, private httpSer: HttpHandlerService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initFormControls()

    //get first
    this.getWeightSettings()
  }


  initFormControls() {
    this.form = this.fb.group({
      id : [null],
      meetingWeight: [null, [Validators.required , Validators.min(0) , Validators.max(100)] ],
      taskWeight: [null, [Validators.required ,Validators.min(0) , Validators.max(100) ]],
      kpiRateWeight : [null ,[Validators.required,Validators.min(0) , Validators.max(100)] ]
    });
  }

  getWeightSettings(){
    this.httpSer
    .get(Config.WeightSettings.Get)
    .pipe(finalize(() => (this.isLoading = false)))
    .subscribe((res) => {
      if (res) {
      //  console.log('weight res' , res)
        this.form.patchValue(res)
      }
    });
  }

  submitWeight(){
    this.loaderSave = true
    this.disableFields = true
    this.httpSer
      .put(Config.WeightSettings.Update, this.form.value)
      .pipe(finalize(() => (this.loaderSave = false)))
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeWeightSettings.updateSuccess'));
          this.disableFields = false

        }
      });
  }

}
