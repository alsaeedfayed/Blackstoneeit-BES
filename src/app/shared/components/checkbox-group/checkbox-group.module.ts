import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { CheckboxGroupComponent } from './checkbox-group.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CheckboxComponent, CheckboxGroupComponent],
  imports: [CommonModule, FormsModule],
  exports: [CheckboxComponent, CheckboxGroupComponent],
})
export class CheckboxGroupModule {}
