import { UserInfo } from "../../models/UserInfo";

export interface ObservationComment {
  id: number;
  auditObservationId: number;
  text: string;
  time: string;
  commentor: UserInfo;
  isUserComment: boolean;
  attachments: any[];
}