import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioGroupComponent } from './radio-group.component';
import { RadioBoxComponent } from './radio-box/radio-box.component';

@NgModule({
  declarations: [RadioGroupComponent, RadioBoxComponent],
  imports: [CommonModule],
  exports: [RadioGroupComponent, RadioBoxComponent],
})
export class RadioGroupModule {}
