export interface Committee {
  id: number;
  name: string;
  nameAr: string;
  membersCount: number;
  creationDate: Date;
  updatedDate?: Date;
  isInactive: boolean;
}