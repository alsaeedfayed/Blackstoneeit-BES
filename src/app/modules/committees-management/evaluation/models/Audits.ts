export interface CommitteAudits {
  count : number,
  data : CommitteAudit[]
}

export interface CommitteAudit {
  id : number,
  committeeId : number,
  committeeName : string,
  committeeNameAr : string,
  referenceNumber : string,
  status : number,
  title : string,
  titleAr : string,
  from : string,
  to : string,
  type : number,
  updatedDate : string
}
