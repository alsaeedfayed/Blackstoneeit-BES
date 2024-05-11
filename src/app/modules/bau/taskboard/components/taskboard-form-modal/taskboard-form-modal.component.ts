import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { PopupService } from "src/app/shared/popup/popup.service";
import { Config } from "src/app/core/config/api.config";
import { Router } from "@angular/router";
import { BAUStateService } from "../../services/bau-state.service";

@Component({
  selector: 'app-taskboard-form-modal',
  templateUrl: './taskboard-form-modal.component.html',
  styleUrls: ['./taskboard-form-modal.component.scss']
})
export class TaskboardFormModalComponent implements OnInit {
  public isLoading: boolean = false;
  selectedYear: string = "";
  form: FormGroup;
  previousYears: { year: number; boardId: number }[] = [];

  constructor(
    private fb: FormBuilder,
    private popupService: PopupService,
    private httpSer: HttpHandlerService,
    private stateService: BAUStateService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    this.form = this.fb.group({
      budget: [null, [Validators.required, this.validateBudgetMaxValue()]],
      year: [null, []],
      creationStatus: this.fb.control(null, Validators.required),
    });
    this.selectedYear = this.stateService.getYear();
  }

  ngOnInit(): void {
    this.getTaskBoards();
    this.checkPreviousYearVaildation();
  }

  validateBudgetMaxValue() {
    return control => {
      const maxValue = 9999999999.999;
      if (control.value && control.value > maxValue) {
        return { maxBudgetExceeded: true };
      }
      return null; // Validation passed
    };
  }

  checkPreviousYearVaildation() {
    // Add a valueChanges subscription to 'creationStatus' control
    this.form.get("creationStatus").valueChanges.subscribe(value => {
      if (value === "previous") {
        this.form.get("year").setValidators(Validators.required);
      } else {
        this.form.get("year").setValidators([]);
        this.form.get("year").setValue(null);
      }
      this.form.get("year").updateValueAndValidity();
    });
  }

  ngDoCheck() {
    // Manually trigger change detection when the selected year is updated
    this.selectedYear = this.stateService.getYear();
    this.cd.detectChanges();
  }

  onPopupClose() {
    this.popupService.close();
  }

  onSubmit() {
    const body = {
      budget: this.form.value.budget,
      year: parseInt(this.selectedYear),
      copyFromYear: this.form.value.year || 0,
    };
    this.httpSer.post(Config.BAU.TasksManagement.createBoard, body).subscribe(res => {
      if (res) {
        this.router.navigateByUrl(`/bau/taskboard/${this.selectedYear}`);
      }
    });
  }

  getTaskBoards() {
    this.httpSer.get(Config.BAU.TasksManagement.getAllBoards).subscribe(res => {
      this.previousYears = res.map(item => item.year);
    });
  }
}
