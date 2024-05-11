export interface Challenge {
  title?: string,
  description?: string,
  createdBy?: string,
  coverImage?: {
    "fileUrl": "string",
    "fileName": "string",
    "extension": "string",
    "uploadedFileName": "string"
  },
  status?: number,
  focusArea?: string[],
  startDate?: string,
  endDate?: string,
  relatedPoints?: number,
  creationDate?: string,
  rewardType?: string,
  amount?: number,
  awardCertification?: string,
  ideasCount?: string,
  attachments?: [],
  organizer?:any
}

