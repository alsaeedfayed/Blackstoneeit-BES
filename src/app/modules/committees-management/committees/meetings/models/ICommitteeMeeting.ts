import { ICommitteeMeetingExternalAttendee } from "./ICommitteeMeetingExternalAttendee";
import { ICommitteeMeetingActualAttendee } from "./ICommitteeMeetingActualAttendee";
import { MeetingStatus } from "../../../enums/enums";

export interface ICommitteeMeeting {
  id: number;
  committeeId: number;
  name: string;
  location: string;
  locationType: number;
  date: Date;
  timeFrom: Date;
  timeTo: Date;
  status: MeetingStatus
  notes: string;
  generalNotes: string;
  attendeeIds: [];
  externalAttendees: ICommitteeMeetingExternalAttendee[];
  actualAttendees: ICommitteeMeetingActualAttendee[];
  agenda: string;
  sendNotificationToAllAttendee: Boolean;
  sendNotificationToGuest: Boolean;
  includeAgenda: Boolean;
  includeAttachment: Boolean;
  notificationMessage: string;
  creationDate: Date;
  notesAttachments: any;
  messageAttachments: any;
  generalNotesAttachments: any;
  agendaAttachments: any;
  CreatedBy: string;
  CreatorInfo: any;
  UpdatedBy: string;
  UpdaterInfo: any;
  instanceId?:number;
  resumeWorkflowAction: boolean;
  canComment:boolean;
  canPublish?: boolean;
  canSave?: boolean;
  canEdit?: boolean;
}
