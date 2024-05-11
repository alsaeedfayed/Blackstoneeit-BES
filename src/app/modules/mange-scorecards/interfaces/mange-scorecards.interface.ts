export interface IScorecard {
  readonly id: number,
  title: string,
  titleAr: string,
  excecutionYear: number,
  currentLevel: number,
  creationDate: string,
  current: boolean,
  currentStatus: number,
  description: string;
  edit?: boolean
}


export interface IStatusDetails {
  groupName: string,
  groupNameAr: string,
  level: number,
  status: number
}
