export interface MainTask {
  id: number;
  year: number;
  titleEn: string;
  titleAr: string;
  description: string;
  importanceLevel: number;
  progressStatus:number;
  progress: number;
  budget: number;
  startDate: string;
  endDate: string;
  sector: {
    id: number;
    code: string;
    name: string;
    arabicName: string;
    level: number;
    children: string[];
  };
  department: {
    id: number;
    code: string;
    name: string;
    arabicName: string;
    level: number;
    children: string[];
  };
  section: {
    id: number;
    code: string;
    name: string;
    arabicName: string;
    level: number;
    children: string[];
  };
  assignedTo: {
    id: string;
    email: string;
    userName: string;
    fullName: string;
    position: string;
    fileName: string;
    fullFileName: string;
    base64Image: string;
    fullArabicName?:string;
  };
  createdBy: {
    id: string;
    email: string;
    userName: string;
    fullName: string;
    position: string;
    fileName: string;
    fullFileName: string;
    base64Image: string;
  };
  attachments: {
    fileUrl: string;
    fileName: string;
    extension: string;
    uploadedFileName: string;
  }[];
  relatedKPIs: {
    id: number;
  }[];
  linkedRoles: {
    id: number;
    nameEn: string;
    nameAr: string;
  }[];
}