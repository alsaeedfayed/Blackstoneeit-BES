import { ServicesStatus } from './services-status';

export interface Service {
  id: number;
  serviceId: number;
  title: string;
  cateogryId: number;
  formLinked: boolean;
  processLinked: boolean;
  formName: string;
  processName: string;
  isPublished: boolean;
  cateogryName: string;
  createdBy: string;
  status: ServicesStatus;
  isFavouritLoading?: boolean;
  rating: number;
  count: number;
  favourite: boolean;
  titleAr: string;
  cateogryNameAr: string;
  processId: number;
  processNameAr: string;
}