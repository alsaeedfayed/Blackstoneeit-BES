import { UserInfo } from "../../../models/UserInfo";

export interface DecisionSendHistory {
  id?: number;
  message: string;
  creationDate: string;
  createdBy: string;
  tos: string[];
  tosInfo: UserInfo[];
  ccs: string[];
  ccsInfo: UserInfo[];
}