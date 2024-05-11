import { Objective } from './Objective';
import { UserInfo } from './UserInfo';
import { Tag } from './Tag';
import { IUpcomingMeeting } from '../committees/models/IUpcomingMeeting';
export interface ICommitteeInfo {
  id?: number;
  name: string;
  nameAr: string;
  status: number;
  sponsor: string;
  sponsorInfo: UserInfo;
  chairman: string;
  chairmanInfo: UserInfo;
  viceChairmanIds: string[];
  viceChairmanInfo: UserInfo[];
  committeeSecretaryInfo: UserInfo[],
  committeeSecretaryIds: string[];
  // secretaryInfo: UserInfo[];
  creationDate: Date;
  committeeType: string;
  committeeTypeName: string;
  committeeTypeNameAr: string;
  description: string;
  duration: string;
  DurationName: string;
  DurationNameAr: string;
  membersCount?: number;
  members: UserInfo[];
  memberIds: string[];
  objectives: Objective[];
  tags: Tag[];
  attachments: any[];
  upcomingMeetings: IUpcomingMeeting[];
  goalIds?: number[];
  committeeDurationType?: number;
  canEdit?: boolean;
  decisionNumber: string;
  decisionText: string;
  decisionDate: string;
  measurableGoalIds?: number[];
  committeeExternalMembers?: any;
}


