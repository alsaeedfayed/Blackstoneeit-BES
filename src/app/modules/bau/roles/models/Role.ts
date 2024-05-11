export interface Role {
  id: number;
  nameEn: string;
  nameAr: string;
  description: string;
  sector: GroupModel;
  department: GroupModel;
  section: GroupModel;
  attachments: any[];
  creationDate: string;
  updatedDate: string;
  isTackingAction?: boolean;
}

export interface GroupModel {
  id: number;
  code: string;
  name: string;
  arabicName: string;
  level: number;
  parentId?: number;
}