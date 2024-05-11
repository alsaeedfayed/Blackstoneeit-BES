import { IAttendee } from './../meeting-details/iMeetingDetails.interface';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BadgeCountService {
  public attndeesCount:number = 0;
  public discussionItemsCount:number = 0;
  public actionItemsCount:number = 0;

  private attendees:BehaviorSubject<number> = new BehaviorSubject(this.attndeesCount);
  public attendeesCount$ = this.attendees.asObservable();

  private discussionItems: BehaviorSubject<number> = new BehaviorSubject(this.discussionItemsCount);
  public discussionItemsCount$ = this.discussionItems.asObservable();

  private actionItems: BehaviorSubject<number> = new BehaviorSubject(this.actionItemsCount);
  public actionItemsCount$ = this.actionItems.asObservable();

  private attendeesList:BehaviorSubject<IAttendee[]> = new BehaviorSubject(null);
  public attendeesList$ = this.attendeesList.asObservable();

  constructor() { }

  changeAttendeesCount(value:number){
    // debugger
    this.attndeesCount = value;
    this.attendees.next(this.attndeesCount);
  }

  changeDiscussionItemsCount(value: number) {
    this.discussionItemsCount = value;
    this.discussionItems.next(this.discussionItemsCount);
  }

  changeActionItemsCount(value: number) {
    this.actionItemsCount = value;
    this.actionItems.next(this.actionItemsCount);
  }

  chnageAttenddesList(attendeesList:IAttendee[]){
    this.attendeesList.next(attendeesList)
  }
}
