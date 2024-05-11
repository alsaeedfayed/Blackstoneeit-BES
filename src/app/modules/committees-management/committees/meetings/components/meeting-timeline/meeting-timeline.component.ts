import { MeetingStatus } from 'src/app/modules/committees-management/enums/enums';
import { UserInfo } from './../../../../models/UserInfo';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-meeting-timeline',
  templateUrl: './meeting-timeline.component.html',
  styleUrls: ['./meeting-timeline.component.scss']
})
export class MeetingTimelineComponent implements OnInit {

  @Input() status: MeetingStatus = 0 as MeetingStatus;
  @Input() creator: UserInfo;
  @Input() momRecordedBy: UserInfo;
  @Input() committeeChairman;
  currentStep: number = 0;


  constructor() { }
  cards: {
    cardStatus: string,
    cardBackGroundColor: string,
    badgeClass: string,
    badgeIcon: string,
    badgeMsg: string,
    user: {},
    msg: string,
  }[] = []
  ngOnInit(): void {

    this.currentStep = this.checkStatus();

    for (let i = 0; i <= 4; i++) {
      let card;
      if (i + 1 < this.currentStep) {

        card = {
          cardStatus: "completed",
          cardBackGroundColor: "white",
          badgeClass: "completed",
          badgeIcon: "bxs-check-circle",
          badgeMsg: "committeeMeetingDetails.meetingTimeline.completed"
        }
      } else if (i + 1 == this.currentStep) {
        card = {
          cardStatus: "current",
          cardBackGroundColor: "gray",
          badgeClass: "pending",
          badgeIcon: "bx-error-circle",
          badgeMsg: "committeeMeetingDetails.meetingTimeline.pending"
        }
      }
      else {
        card = {
          cardStatus: "upcoming",
          cardBackGroundColor: "gray",
          badgeClass: "upcoming",
          badgeIcon: "bx-loader-circle",
          badgeMsg: "committeeMeetingDetails.meetingTimeline.upcoming"
        }
      }
      this.cards[i] = card;
    }

    //creator
    this.cards[0].user = this.creator;
    this.cards[0].msg = "committeeMeetingDetails.meetingTimeline.createMeeting";

    //publish meeting
    this.cards[1].user =null;
    this.cards[1].msg = "committeeMeetingDetails.meetingTimeline.publishMeeting";

    //publish mom
    this.cards[2].user =  this.momRecordedBy;
    this.cards[2].msg = "committeeMeetingDetails.meetingTimeline.publishMOMForReview";

    //approval 
    this.cards[3].user = this.committeeChairman;
    this.cards[3].msg = "committeeMeetingDetails.meetingTimeline.finalApproval";

    //end
    this.cards[4].user = null;
    this.cards[4].msg = "committeeMeetingDetails.meetingTimeline.approved";
  }


  checkStatus(): number {
    // return current step number
    switch (this.status) {
      case MeetingStatus.Draft:
        return 2; //Publish Meeting

      case MeetingStatus.NotDueYet:
      case MeetingStatus.PendingMOM:
      case MeetingStatus.Returned:
        return 3; //Publish MOM for Review
      
      case MeetingStatus.UnderReview:
        return 4; //Final Approval

      case MeetingStatus.Completed:
        return 6; //Final Approval

      default:
        return 6; //approved
    }
  }

  // checkStatus(): number {
  //   switch (this.status) {
  //     case 0: //draft
  //     case 1: //not due yet
  //     case 2: //pendingMom
  //       return 2; //Publish MOM for Review
  //     case 5: //draft
  //       return 3; //Reviewing MOM
  //     case 3: //draft
  //       return 4; //Final Approval
  //     default:
  //       return 6; //approved
  //   }
  // }

}
