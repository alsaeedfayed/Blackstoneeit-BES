import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'see-more',
  templateUrl: './see-more.component.html',
  styleUrls: ['./see-more.component.scss'],
})
export class SeeMoreComponent implements OnInit {
  public isShowAllDesc: boolean = false;
  // Inputs & Outputs
  @Input() text: string;
  @Input() maxWidth: string;
  @Input() maxCharcters: number = 120;
  constructor() {}

  ngOnInit(): void {}

  public get textContent(): string {
    if (this.text) {
      return this.isShowAllDesc
        ? this.text
        : this.text.length > this.maxCharcters
        ? this.text.slice(0, this.maxCharcters).concat('...')
        : this.text;
    }
    return "-";
  }
}
