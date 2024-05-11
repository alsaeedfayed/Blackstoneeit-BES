export interface IHistory {
  assignedTo: {
    id: string;
    email: string;
    userName: string;
    fullName: string;
    roles: string[];
    fileName: string;
    profileImage: string
  };
  comments: string;
  state: string;
  time: string;
  attachments: IAttachment[];
}

interface IAttachment {
  fileName: string;
  extension: string;
}
