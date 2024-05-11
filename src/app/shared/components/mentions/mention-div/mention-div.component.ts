import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mention-div',
  templateUrl: './mention-div.component.html',
  styleUrls: ['./mention-div.component.scss']
})
export class MentionDivComponent implements OnInit {

  constructor() { }
  @Input() comment: string = '';
  @Input() mentionedInfo: any[] = [];

  arrangedUsers: any[] = [];

  uuidPattern = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;

  parts: string[] = [];

  ngOnInit(): void {
    this.secondWay()
  }

  secondWay() {
    const partsWithoutUUIDs = this.comment.split(this.uuidPattern);
    const uuids = this.comment.match(this.uuidPattern);
   
    uuids && uuids.forEach((id,i) => {
      let user = this.mentionedInfo.find(u=>u.id == id);
      this.arrangedUsers[i] = user ? user :id;
    })
    // this.mentionedInfo.forEach((user) => {
    //    this.arrangedUsers[uuids.indexOf(user.id)] = user;
    // })

    this.parts = this.mergeArrays(partsWithoutUUIDs, this.arrangedUsers);
  }

  mergeArrays(array1: any[], array2: any[]): any[] {
    const result: any[] = [];
    const length = Math.max(array1.length, array2.length);

    for (let i = 0; i < length; i++) {
      if (i < array1.length) {
        result.push(array1[i]);
      }
      if (i < array2.length) {
        result.push(array2[i]);
      }
    }

    return result;
  }

}
