export enum sortDirections {
  Asc = 1,
  Desc = 2,
}

//Requests
export enum RequestsSortBy {
  creationDate = 'creationDate',
  status = 'status',
  name = 'name',
  nameAr = 'nameAr',
}

export enum changeRequestBy {
  Title = 'reason',
  CreationDate = 'CreationDate',
  committeeName = 'committeeName',
  committeeChairman = 'committeeChairman',
  Code = 'Code',
  createdBy = 'createdBy',
  Status = 'Status',
  name = 'name',
  nameAr = 'nameAr',
}

export enum committeeAuditsSortBy {
  name = 'name',
  activeStatus = 'activeStatus',
  decisionNumber = 'decisionNumber',
  creationDate = 'creationDate',
  attendanceRate = 'attendanceRate',
  kpiPerformance = 'kpiPerformance',
  MainTaskProgress = 'MainTaskProgress',
  effictivenessPercentage = 'effictivenessPercentage'
}

export enum evaluationSortBy {
  type = 'type',
  creationDate = 'creationDate',
  status = 'status',
}
export enum RequestStatus {
  Draft = 0,
  Pending = 1,
  Rejected = 2,
  Completed = 3,
  Canceled = 4,
  Returned = 5,
}

//Decisions
export enum DecisionStatus {
  Open = 0,
  Pending = 1,
  Rejected = 2,
  Completed = 3,
  InProgress = 4
}

//Meetings
export enum MeetingStatus {
  Draft = 0,
  NotDueYet = 1,
  PendingMOM = 2,
  UnderReview = 3,
  Completed = 4,
  Returned = 5,
}
export enum LocationType {
  OnSite = 0,
  MicrosoftTeams = 1,
}

//Voting
export enum VotingTemplatesSortDirections {
  Asc = 1,
  Desc = 2,
}
export enum VotingTemplatesSortBy {
  name = 'name',
  nameAr = 'nameAr',
}

//Tasks
export enum ImportanceLevel {
  Low = 0,
  Medium = 1,
  High = 2,
}
export enum TaskStatus {
  NotStarted = 0,
  InProgress = 1,
  Done = 2,
  UnderReview = 3,
}
export enum TasksSortBy {
  title = 'title',
  creationDate = 'creationDate',
  dueDate = 'dueDate',
  importanceLevel = 'importanceLevel',
  commentsCount = 'commentsCount',
  attachmentsCount = 'attachmentsCount',
  progress = 'progress',
  status = 'status',
}
export function getEnumKeyByValue<T>(enumObj: T, enumValue: any): keyof T {
  return Object.keys(enumObj).find(key => enumObj[key] === enumValue) as keyof T;
}

export enum frequencyType {
  monthly = 0,
  quarterly = 1,
  biYearly = 2,
  yearly = 3,
  date = 4
}

export enum measurementType {
  number = 1,
  percent = 2,
  currency = 3,
}
