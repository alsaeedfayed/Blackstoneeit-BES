import { UserInfo } from './../../../models/UserInfo';

export interface IDiscussedItem {
    id?: number,
    meetingId: number,
    name: string,
    duration: number,
    description: string,
    presentedBy: string,
    presenterInfo: UserInfo,
    createdBy: string,
    creatorInfo: UserInfo,
    creationDate: Date,
    attachments: any[]
}