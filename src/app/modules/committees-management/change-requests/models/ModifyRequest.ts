export interface ModifyRequest {
  id?: number;
  committeeId: number;
  instanceId: number;
  status: number;
  reason: string;
  description: string;
  createdBy: string;
  canEdit: boolean;
  committeeData: {
    id: number;
    name: string;
    nameAr: string;
    committeeType: string;
    duration: string;
    durationName: string;
    durationNameAr: string;
    chairman: string;
    viceChairmanIds: string[];
    sponsor: string;
    committeeSecretaryIds: string[];
    memberIds: string[];
    goalIds: number[];
    attachments: {
      fileName: string;
      extension: string;
      uploadedFileName: string;
    }[];
    description: string;
    location: string;
    committeeKpis: {
      disabled: boolean;
      dueDate: string;
      measurementRecurrence: number;
      id: number;
      committeeId: number;
      name: string;
      nameAr: string;
      weight: number;
      target: number;
      description: string;
      attachments: {
        fileName: string;
        extension: string;
        uploadedFileName: string;
      }[];
    }[];
    mainTasks: {
      disabled: boolean;
      dueDate: string;
      id: number;
      title: string;
      titleAr: string;
    }[];
    tags: {
      id: number;
      tag: string;
    }[];
  };
}

