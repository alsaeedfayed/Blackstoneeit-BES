import { AttendeeType } from "./enums";

export interface IMeetingDetails {
  id: number;
  title: string;
  chairpersonInfo: IPersonInfo;
  canSave:boolean;
  canSubmit:boolean;
  initiatorInfo: IPersonInfo;
  commiteeId: string;
  location: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  attendees: Array<IAttendee>;
  actionItems: Array<IActionItem>;
  discussionItems: Array<IDiscussionItem>;
  status: number;
  actionItemsCompletionRate: number
}

export interface IActionItem {
  readonly id: string;
  meetingId: number;
  action: string;
  dueDate: string;
  assginee: string;
  assgineeInfo: IPersonInfo;
  topic:string;
  isCloneClicked: boolean;
}

export interface IDiscussionItem {
  readonly id: string;
  meetingId: number;
  title: string;
  presenter: string;
  duration: string;
  notes: string;
  presenterInfo: IPersonInfo;
  attachments: Array<any>;
}

export interface IAttendee {
  readonly id: string;
  meetingId: number;
  userId: string;
  position: string;
  notes: string;
  userInfo: IPersonInfo;
  attended: boolean;
  requestToSign: boolean;
  attendeeType: AttendeeType;
  externalAttendeeName: string;
  externalAttendeeEmail: string;
}

export interface IPersonInfo {
  email: string;
  userName: string;
  roles: Array<string>;
  fileName: string;
  readonly id: string;
  fullName: string;
  position: string;
}

export interface IMinOfMeeting {
  title: string;
  chairpersonInfo: IPersonInfo;
  initiatorInfo: IPersonInfo;
  commiteeId: string;
  location: string;
  date: string;
  timeFrom: string;
  timeTo: string;
}
