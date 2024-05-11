export interface ImeetingStatiitics {
  approvedCount:number,
  draftCount: number,
  underReviewCount: number,
  closedCount: number,
  myActionsClosedCount: number,
  myActionsNewCount: number,
  allCount : number
}

export interface viewMeetingsRes {
  statitics: ImeetingStatiitics;
  meetings: {
    count: number;
    data: iMeetingsView[]
  }
}

export interface iMeetingsView {
  id: string,
  title: string,
  number: string,
  date: string,
  commiteeId: string,
  time: string,
  location: string,
  chairperson: string,
  createdBy: string,
  creatorInfo: {
    email: string,
    userName: string,
    roles: string[
    ],
    fileName: string,
    id: string,
    fullName: string,
    position: string
  },
  status: number,
  attendeesCount: number,
  instanceId: number
}
