import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements OnInit {

  @Input('title') title: string;
  @Input() icon: string;
  @Input() count: number;
  @Input() value: any;
  @Input() private _active: boolean;

  public get active(): boolean {
    return this._active;
  }

  public set active(value: boolean) {
    this._active = value;

    if (value) {
      this.renderer.addClass(this.elementRef.nativeElement, 'active');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'active');
    }
  }

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
  }
}
