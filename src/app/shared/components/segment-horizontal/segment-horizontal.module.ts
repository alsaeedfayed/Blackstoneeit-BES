import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SegmentHorizontalComponent } from './segment-horizontal.component';
import { SegmentButtonComponent } from './components/segment-button/segment-button.component';

@NgModule({
  declarations: [SegmentHorizontalComponent, SegmentButtonComponent],
  imports: [CommonModule],
  exports: [SegmentHorizontalComponent, SegmentButtonComponent],
})
export class SegmentHorizontalModule {}
