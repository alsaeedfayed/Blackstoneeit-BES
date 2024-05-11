export interface committeeAudits {
  count: number,
  data: committeeAudit[]
}

export interface committeeAudit {
  id: number,
  referenceNumber: string,
  status: number,
  from: string,
  to: string,
  type: string,
  typeName: string,
  typeNameAr: string,
  updatedDate: string,
  closedObservations: number,
  openObservations: number
}
