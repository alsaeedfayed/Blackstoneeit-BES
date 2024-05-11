import { Observation } from "./Observation";

export interface EvaluationData {
  count: number;
  data: Evaluation[]
}

export interface Evaluation {
  id: number;
  committeeId: number;
  committeeName: string;
  committeeNameAr: string;
  from: string;
  to: string;
  description: string;
  status: number;
  type: string;
  typeName: string;
  typeNameAr: string;
  recommendation: string;
  attachments: any[];
  observations: Observation[];
  updatedDate: string;
  creationDate: string;
  canAddObservation: boolean;
  canCancelAudit: boolean;
  canCloseAudit: boolean;
  recommendationAttachments: any[];
}
