import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent implements OnInit {
  @Input() bgColor
  @Input() progressWidth
  @Input() lable

  constructor() { }

  ngOnInit(): void {
  }

}
