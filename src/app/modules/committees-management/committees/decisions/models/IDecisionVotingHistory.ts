import { UserInfo } from "../../../models/UserInfo";

export interface IDecisionVotingHistory {
  id: number;
  memberType: number;
  voterId: string;
  voterInfo: UserInfo
  votingAnswer: number;
  creationDate: string;
}