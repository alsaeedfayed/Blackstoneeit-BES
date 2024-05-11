export interface MeasurementType {
  id: number;
  title: { en: string, ar: string };
  prefix: { en: string, ar: string };
  isActive?: boolean;
}