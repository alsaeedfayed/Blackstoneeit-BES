import { Component, Input, OnInit,Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-request-header',
  templateUrl: './request-header.component.html',
  styleUrls: ['./request-header.component.scss'],
})
export class RequestHeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() isValid = false;
  @Output() submit = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  backToLastPage() {}

  onSubmitEvent() {}
}