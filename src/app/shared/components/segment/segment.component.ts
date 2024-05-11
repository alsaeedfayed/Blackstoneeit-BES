import {
  Component,
  ContentChildren,
  OnInit,
  Output,
  QueryList,
  EventEmitter,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SegmentButtonComponent } from './components/segment-button/segment-button.component';

@Component({
  selector: 'app-segments',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SegmentComponent,
      multi: true,
    },
  ],
})
export class SegmentComponent implements ControlValueAccessor, OnInit {
  @ContentChildren(SegmentButtonComponent)
  segments: QueryList<SegmentButtonComponent>;

  private onChange = (value: string) => {};
  private onTouched = () => {};
  private oldValue;

  @Output() changeButton: EventEmitter<void> = new EventEmitter();
  ngOnInit(): void {}

  selectSegment(segment: any = {}) {
    // deactivate all tabs
    this.segments.toArray().forEach((segment) => (segment.active = false));
    this.onChange(segment?.value);
    // activate the tab the user has clicked on.
    segment.active = true;
    if(this.oldValue != segment?.value){
      this.changeButton.emit();
    }
  }

  writeValue(value: string): void {
    setTimeout(() => {
      this.findSegmentByValue(value);
    }, 200);
  }

  findSegmentByValue(value: string) {
    const segment = this.segments.toArray().find((segment) => {
      return segment.value == value;
    });
    this.selectSegment(segment);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
