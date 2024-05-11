export interface MainTask {
  id?: number;
  title: string;
  titleAr: string;
  dueDate: string;
  description: string;
  attachments: any[];
  assignedTo? : any,
  importanceLevel : any,
  assignedToInfo?: any,
  code?: any;
}
