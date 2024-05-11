import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-data-custom',
  templateUrl: './no-data-custom.component.html',
  styleUrls: ['./no-data-custom.component.scss'],
})
export class NoDataCustomComponent implements OnInit {
  @Input() msg: string = "Hmm.. looks like you don't have any Services";
  
  constructor() {}

  ngOnInit(): void {}
}
