
export interface basicInformationItem {
  fieldName : string,
  fieldNameAr : string,
  oldValue : string,
  oldValueAr : string,
  newValue : string,
  newValueAr : string
}

export interface changedDataMember {
  name : string,
  nameAr : string,
  position : string,
  positionAr : string,
  role : string,
  roleAr : string,
  changeType : number
}

export interface changedKpis {
  title : string,
  titleAr : string,
  changeType : number,
  hasDetails : boolean
}

export interface changedMainTasks {
  title : string,
  titleAr : string,
  changeType : number,
  hasDetails : boolean
}
