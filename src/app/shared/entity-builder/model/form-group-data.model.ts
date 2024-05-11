import { AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';

export class FormGroupData {
  constructor(
    public readonly controls: object = {},
    public readonly valueChanges: Subject<Object> = new Subject(),
    public readonly values: object = {},
    public invalid: boolean = true
  ) {}

  public addControl(name: string | number, control: AbstractControl) {
    this.controls[name] = control;
    this.handleChangeForm(name, control);
    this.handleInvalidStatus();
  }

  public removeControl(name: string) {
    delete this.controls[name];
    delete this.values[name];
  }

  public get(name: string) {
    return this.controls[name];
  }

  private handleChangeForm(name, control: AbstractControl) {
    control?.valueChanges.subscribe((res) => {
      this.values[name] = control?.value;
      this.handleInvalidStatus();
      this.valueChanges.next(this.values);
    });
  }

  private handleInvalidStatus() {
    this.invalid = Object.values(this.controls).some((c) => c?.invalid);
  }
}
