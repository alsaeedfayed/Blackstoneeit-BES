import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-number-range-picker',
  templateUrl: './number-range-picker.component.html',
  styleUrls: ['./number-range-picker.component.scss']
})
export class NumberRangePickerComponent implements OnInit {

  @Input() title: any = null;
  @Input() isRequired: boolean = false;

  constructor(private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.initFilterFormControls();
  }
  form: FormGroup;
 
 
  // initialize filter form controls
  initFilterFormControls() {
    this.form = this.fb.group({
      status: this.fb.control(null),
      sortKey: this.fb.control(null),
    });
  }
}
