export interface INotification {
  readonly id :number,
  subject: string,
  module: string,
  userID: string,
  targetId: string,
  type: string,
  description: string,
  from: {
    email: string,
    userName: string,
    roles: string[
    ],
    fileName: string,
    id: string,
    fullName: string,
    position: string
  },
  date: string;
  isRead:boolean;
}
