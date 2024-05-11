import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-guage-drawer',
  templateUrl: './guage-drawer.component.html',
  styleUrls: ['./guage-drawer.component.scss']
})
export class GuageDrawerComponent implements OnInit {

  //TODO VARIABLES
  @Input() type: string
  @Input() size: number;
  @Input() thick: number
  @Input() value: number
  @Input() multi: boolean = false;
  @Input() text: string
  @Input() multiText : boolean = false
  @Input() foregroundColor: string;
  @Input() backgroundColor: string;
  @Input() thresholds: string;
  @Input() icon: string
  @Input() iconColor : string
  @Input() leftColor : string
  @Input() rightColor : string
  @Input() leftText : string
  @Input() rightText : string

  constructor() { }

  ngOnInit(): void {
  }

}
