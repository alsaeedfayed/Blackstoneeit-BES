export interface Audit {
  id?: number;
  committeeId:number;
  title: string;
  titleAr: string;
  dateFrom:Date;
  dateTo:Date;
  type:number;
  Description:string;
}