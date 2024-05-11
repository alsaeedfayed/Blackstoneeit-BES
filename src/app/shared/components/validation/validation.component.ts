import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
})
export class ValidationComponent implements OnInit {
  ngOnInit(): void {
    this.control.valueChanges.subscribe((re) => {
      // console.log(this.keysOfErrors, 'sdsd');
    });
  }
  @Input() control: FormControl | undefined;
  @Input() length: number;
  @Input() minLength: number = 0;
  @Input() maxLength: number = 0;
  @Input() valideMax : boolean = true

  get keysOfErrors() {
    if (this.control?.errors) return Object.keys(this.control?.errors as []);
    return [];
  }
}
