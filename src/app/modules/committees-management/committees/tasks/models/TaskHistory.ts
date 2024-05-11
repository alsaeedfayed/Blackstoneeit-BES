import { UserInfo } from "../../../models/UserInfo";

export interface TaskHistory {
  id?: any;
  message: string;
  createdBy: string;
  creatorInfo: UserInfo;
  entityId: string;
  entity: string;
  creationDate: string;
}