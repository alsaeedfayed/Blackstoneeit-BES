import { Component, Input, OnInit } from '@angular/core';
import { UserInfo } from '../../../models/UserInfo';

@Component({
  selector: 'app-committee-members-column',
  templateUrl: './committee-members-column.component.html',
  styleUrls: ['./committee-members-column.component.scss']
})
export class CommitteeMembersColumnComponent implements OnInit {

  constructor() { }

  @Input() language: string = '';

  _chairman: UserInfo = null;
  _viceChairmans: UserInfo[] = [];
  _secretaries: UserInfo[] = [];
  _members: UserInfo[] = [];
  _externalMembers: UserInfo[] = [];

  @Input()
  // memberType = 1 --> chairman
  // memberType = 2 --> vice chairman
  // memberType = 3 --> secretary
  // memberType = 4 --> member
  // memberType =5 --> external member
  public set members(v: { memberType?: number, member: UserInfo }[]) {
    v?.forEach(m => {
      switch (m.memberType) {
        case 1:
          this._chairman = m.member;
          break;
        case 2:
          this._viceChairmans.push(m.member);
          break;
        case 3:
          this._secretaries.push(m.member);
          break;
        case 4:
          this._members.push(m.member);
          break;
        case 5:
          this._externalMembers.push(m.member);
          break;

        default:
          break;
      }
    })
  }

  ngOnInit(): void {
  }


}
