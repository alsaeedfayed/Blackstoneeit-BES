import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SegmentComponent } from './segment.component';
import { SegmentButtonComponent } from './components/segment-button/segment-button.component';

@NgModule({
  declarations: [SegmentComponent, SegmentButtonComponent],
  imports: [CommonModule],
  exports: [SegmentComponent, SegmentButtonComponent],
})
export class SegmentModule {}
