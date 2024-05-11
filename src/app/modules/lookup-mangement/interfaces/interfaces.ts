export interface ILookup {
  lookupType: string;
  lookupTypeNameEn:string;
  lookupTypeNameAr:string;
  lookupResult: ILookupItem[];
}


export interface ILookupService {
  label:string,
  code:string,
  id:number
}

export interface ILookupItem {
  id: number;
  nameAr: string;
  nameEn: string;
  target: string;
  key: string;
  lookupTypeId: number;
  code: string;
  status: boolean,
  updatedDate: string
}
