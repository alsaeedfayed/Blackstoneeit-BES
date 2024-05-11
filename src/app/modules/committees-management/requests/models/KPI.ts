export interface KPI {
  isDisabled?: boolean;
  dueDate?: string;
  frequency: number;
  id?: number;
  parentId?: number;
  committeeId?: number;
  name: string;
  nameAr: string;
  weight?: number;
  target: number;
  formula?: string;
  risk?: string;
  achievementRequirements?: string;
  ownerId?: string;
  measurementType: number;
  attachments?: Attachment[];
}

interface Attachment {
  fileUrl: string;
  fileName: string;
  extension: string;
  uploadedFileName: string;
}