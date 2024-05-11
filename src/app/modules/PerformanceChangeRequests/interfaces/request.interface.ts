export interface IchangeRequestListRes {
  items: IchangeRequest[];
  count: number;
}

export interface IchangeRequest {
  id: string;
  requestNumber: string;
  title: string;
  titleAr: string;
  level: string;
  creationDate: string;
  ownerId: string;
  owner: {
    email: string;
    userName: string;
    roles: [string];
    fileName: string;
    id: string;
    fullName: string;
    position: string;
  };
  group: {
    id: string;
    name: string;
    arabicName: string;
    path: string;
    level: string;
    children: string[];
    parent: string;
    code: string;
  };
  status: string;
}

export interface IchangeReauestDetails {
  level: string;
  groupId: string;
  group: {
    id: string;
    name: string;
    arabicName: string;
    path: string;
    level: string;
    children: string[];
    parent: string;
    code: string;
  };
  type: string;
  title: string;
  titleAr: string;
  goalTitle: string;
  goalTitleAr: string;
  changeRequestGoalIds: string[];
  reason: string;
  attachments: {
    fileName: string;
    extension: string;
  }[];
  status: number;
  workflowStatus: string;
  ownerEmail: string;
  ownerId: string;
  owner: {
    email: string;
    userName: string;
    roles: string[];
    fileName: string;
    id: string;
    fullName: string;
    position: string;
  };
  requestNumber: string;
  relatedGoals:[]
}


