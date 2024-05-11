
export interface BauDashboardStatisticsModel {
  total?: number,
  delayedCount?: number,
  overallProgress?: number,

}

export interface sectorPerformances {

}

export interface BauDashBoardSectorPerformance {
  groupId?: number,
  name: string,
  nameAr: string,
  total: number,
  onTrackCount?: number,
  onTrackPercentage: number,
  offTrackCount?: number,
  offTrackPercentage: number,
  notStartedCount?: number,
  notStartedPercentage: number
}

export interface BestContributers {
  mainTasksCount?: number,
  subTasksCount?: number,
  employee: User
}

export interface User {
  id?: string,
  email?: string,
  userName?: string,
  fullName?: string,
  position?: string,
  fileName?: any,
  fullFileName?: any,
  base64Image?: any,
  roles?: any
}
export interface implementationTasks {
  total?: number,
  notStartedCount?: number,
  notStartedPercentage?: number,
  inProgressCount?: number,
  inProgressPercentage?: number,
  closedCount?: number,
  closedPercentage?: number,
  data: ImplmentationTask[],
  tranlateLoadr?: any,
  canceledCount: number
}
export interface ImplmentationTask {
  month: string,
  current?: boolean,
  totalTasks?: number,
  notStartedCount: number,
  notStartedPercentage?: number,
  inProgressCount?: number,
  inProgressPercentage?: number,
  closedCount: number,
  closedPercentage?: number,
  canceledCount: number,
  cancelledPercantage?: number
}


export interface taskStatus {
  MainTaskId?: number,
  TitleAr?: string,
  TitleEn?: string,
  NotStartedCount?: number,
  OnTrackCount?: number,
  OffTrackCount: number,
  TotalTasks?: number
}

export interface implementaionsStatus {
  total: number;
  totalSpent: number;
  data: ImplementationStatus[]
}

export interface implementationStatutses {
  data: ImplementationStatus[]
}
export interface ImplementationStatus {
  current?: boolean,
  month: string,
  actualCount: number,
  actualPercentage?: number,
  plannedCount: number,
  plannedPercentage?: number;
}

export interface Budget {
  totalBudget: number,
  spentAmount: number,
  spentAmountPercentage?: number
}

export interface TasksPerQuarter {
  quarter: number,
  totalTasks?: number,
  offTrackCount: number,
  offTrackPercentage?: number,
  onTrackCount: number,
  onTrackPercentage?: number,
  notStartedCount: number,
  notStartedPercentage?: number
}

export interface RoleCoverage {
  roleNameAr?: string,
  roleNameEn?: string,
  tasksCount?: number,
  mainTasksCount?: number
  percentage?: number
}

export interface BauDashboardTasksTable {
  count: number,
  data: BauDashboardTaskDetails[]
}
export interface BauDashboardTaskDetails {
  id?: number,
  titleEn: string,
  titleAr: string,
  progress: number,
  trackStatus: number,
  dueDate: string,
  mainTask: MainTask,
  updatedDate: string,
  sector: GroupModel,
  department: GroupModel,
  section?: GroupModel
  group: { en: string, ar: string };
}

export interface GroupModel {
  id?: number,
  code?: string
  name: string,
  arabicName: string,
  level?: number
}

export interface MainTask {
  Id: number,
  titleAr: string,
  titleEn: string
}
