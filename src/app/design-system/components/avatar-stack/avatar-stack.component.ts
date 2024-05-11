import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'avatar-stack',
  templateUrl: './avatar-stack.component.html',
  styleUrls: ['./avatar-stack.component.scss']
})
export class AvatarStackComponent implements OnInit {

  @Input() members: any = [];
  @Input() initialsOnly: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
