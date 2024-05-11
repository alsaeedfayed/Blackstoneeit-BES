export interface committeesTypes {
  total: number,
  permanentCount: number,
  temporaryCount: number
}

export interface committeesCategories {
  total: number,
  date: committeesCategory[]
}

export interface committeesCategory {
  categoryId: number,
  categoryKey: string,
  categoryName: string,
  categoryNameAr: string,
  totalCommittees: number
}


export interface committeesCategoriesObject {
  total: number,
  executiveName: string,
  executiveNameAr: string,
  executiveTotal: number,
  financeName: string,
  financeNameAr: string,
  financeTotal: number,
  governanceName: string,
  governanceNameAr: string,
  governanceTotal: number,
  auditName: string,
  auditNameAr: string,
  auditTotal: number,
  personalName: string,
  personalNameAr: string,
  personalTotal: number,
  marketingName: string,
  marketingNameAr: string,
  marketingTotal: number,
  socialName: string,
  socialNameAr: string,
  socialTotal: number,
  eventName: string,
  eventNameAr: string,
  eventTotal: number
}
