import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  @Input() imageURL;
  @Input() fullName;
  @Input() position;
  @Input() email;

  constructor() { }

  ngOnInit(): void {
  }

}
