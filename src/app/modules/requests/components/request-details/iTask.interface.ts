export interface ITask {
  id: 0;
  statusEn: string;
  fileName: string;
  assignedTo: {
    id: string;
    email: string;
    userName: string;
    fullName: string;
    roles: string[];
    fileName: string;
    fileUrls: {
      fileUrl: string;
    }[];
  };
  action: {
    titleEn: string;
    labelEn: string;
    commentTitleEn: string;
    comments: string;
    createdDate: string;
    attachments: IAttachment[];
  };
}

interface IAttachment {
  fileName: string;
  extension: string;
}
