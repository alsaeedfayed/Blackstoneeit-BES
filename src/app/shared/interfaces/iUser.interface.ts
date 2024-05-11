export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  active: boolean;
  phoneNumber: string;
  isDeleted: boolean;
  creationDate: string;
  email: string;
  usersGroups: {
    id: number;
    name: string;
    arabicName: string;
    parentId: number;
    parent: string;
    level: string;
    path: string;
    creationDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string;
  }[];
  usersRoles: {
    id: string;
    name: string;
    normalizedName: string;
    concurrencyStamp: string;
    code: string;
    module: number;
    creationDate: string;
    isDeleted: boolean;
    createdBy: string;
    permissions: {
      id: string;
      name: string;
      normalizedName: string;
      code: number;
      updatedDate: string;
      deletedDate: string;
      deleted: boolean;
      createdBy: string;
      creationDate: string;
      updatedBy: string;
      deletedBy: string;
    }[];
  }[];
  userName: string;
  fullName: string;
  userId: string;
  profilePicture: string;
  position: string;
}
