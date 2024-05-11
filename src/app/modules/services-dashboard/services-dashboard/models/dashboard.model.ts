export interface RequestsStatics {
  totalRequests: number
  data: RequestStatics[]
}

export interface RequestStatics {
  status: number
  total: number
  percentage: number
}

export interface RequestStaticsObj {
  totalRequests: number
  started: number
  startedPercentage: number
  cancelled: number
  cancelledPercentage: number
  rejected: number
  rejectedPercentage: number
  closed: number
  closedPercentage: number
}

export interface followUpStatics {
  total: number
  data: followUpItem[]
}

export interface followUpItem {
  status: number
  count: number
  percentage: number
}
export interface followUpMeetingsStatus {
  total: number
  Draft: number
  draftPercentage: number
  UnderReview: number
  underReviewPercentage: number
  Approved: number
  approvedPercentage: number
  Closed: number
  closedPercentage: number

}

export interface CategoriesSLA {
  categoryId: number
  categoryName: string
  categoryNameAr: string
  totalCount: number
  meetSlaCount: number
  outOfSlaCount: number
  notStartedCount: number
}

export interface RequestsUpTracking {
  totalRequests: number
  data: RequestsUpTrackingData[]
}

export interface RequestsUpTrackingData {
  month: string
  meetSlaCount: number
  totalCount: number
  outOfSlaCount: number
  notStartedCount: number
}

export interface FollowUpPerQuarter {
  quarter: number
  total: number
  notStartedCount: number
  openCount: number
  closedCount: number
}

export interface trackingPie {
  offTrackCount: number
  onTrackCount: number
  totalRequests: number
  notStarted?: number
}
export interface MeetingsPerQuarter {
  quarter: number
  total: number
  draftCount: number
  unreviewedCount: number
  approvedCount: number
}

export interface progressTracking {
  totalRequests: number
  data: progressTrackingData[]
}

export interface progressTrackingData {
  month: string
  onTrackCount: number
  totalCount: number
  offTrackCount: number
  notStartedCount: number
}

export interface TopLoadedUsers {
  user: TopLoadedUser
  itemsCount: number
}
export interface TopLoadedUser {
  userId: string
  firstName: string
  lastName: string
  fullName: string
  profileImage: string
  position: string
  roles: string[]
}

export class MeetingsStatus {
  constructor(
    public total: number,
    public draftCount: number,
    public underReviewCount: number,
    public approvedCoun: number,
    public closedCount: number,
  ) { }
}

export interface requestsQueryParams {
  FromDate: string
  ToDate: string
  CategoryId: number
}

export interface followUpQueryParams {
  FromDate: string
  ToDate: string
  SectorId: number
  DepartmentId: number
  SectionId: number
}

export interface closureRate {
  month: string
  count: number
}

export interface followUpItems {
  total: number
  closedCount: number
  openCount: number,
  closedPercentage: number,
  openPrcentage: number
}

export interface servicesDistributions {
  data: servicesDistribution[]
}

export interface servicesDistribution {
  categoryId: number
  categoryName: string
  categoryNameAr: string
  totalCount: number
  percentage: number
}
