
export interface ICommitteeMeetingBasicData {
  name: string;
  location: string;
  locationType: number;
  date: Date;
  timeFrom: Date;
  timeTo: Date;
  notes: string;
  agenda: string;
  notesAttachments: any;
  agendaAttachments: any;
}
