import {
  Component,
  ContentChildren,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SegmentButtonComponent } from './components/segment-button/segment-button.component';

@Component({
  selector: 'app-segment-horizontal',
  templateUrl: './segment-horizontal.component.html',
  styleUrls: ['./segment-horizontal.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SegmentHorizontalComponent,
      multi: true,
    },
  ],
})
export class SegmentHorizontalComponent
  implements ControlValueAccessor, OnInit
{
  @ContentChildren(SegmentButtonComponent)
  segments: QueryList<SegmentButtonComponent>;
  selectedSegment: any = {};
  private onChange = (value: string) => {};
  private onTouched = () => {};

  @Output() changeButton: EventEmitter<void> = new EventEmitter();
  ngOnInit(): void {}

  selectSegment(segment: any) {
    // deactivate all tabs
    this.segments.toArray().forEach((segment) => (segment.active = false));
    this.onChange(segment?.value);
    // activate the tab the user has clicked on.
    segment.active = true;
    this.selectedSegment = segment;
    this.changeButton.emit();
  }

  get isLastSegment() {
    return this.segments.last.value == this.selectedSegment.value;
  }

  get isFirstSegment() {
    return this.segments.first.value == this.selectedSegment.value;
  }

  writeValue(value: string): void {
    if (!!value) {
      setTimeout(() => {
        this.findSegmentByValue(value);
      }, 200);
    }
  }

  findSegmentByValue(value: string) {
    const segment = this.segments.toArray().find((segment) => {
      return segment.value == value;
    });
    this.selectSegment(segment);
  }

  nextStep() {
    const segmentsIndex = this.segments
      .toArray()
      .findIndex((segment) => segment.index == this.selectedSegment.index);
    this.selectSegment(this.segments.toArray()[segmentsIndex + 1]);
  }

  backStep() {
    const segmentsIndex = this.segments
      .toArray()
      .findIndex((segment) => segment.index == this.selectedSegment.index);
    this.selectSegment(this.segments.toArray()[segmentsIndex - 1]);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
