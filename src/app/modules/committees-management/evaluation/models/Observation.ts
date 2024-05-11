export interface Observation {
  id?: number;
  auditId: number;
  title: string;
  titleAr: string;
  type: string;
  typeName: string;
  typeNameAr: string;
  status?: number;
  description: string;
  commentsCount: number;
  canAddComment: boolean;
  loadingAction?: boolean;
}