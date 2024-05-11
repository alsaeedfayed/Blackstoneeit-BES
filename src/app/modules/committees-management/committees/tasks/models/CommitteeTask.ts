import { UserInfo } from "src/app/modules/committees-management/models/UserInfo";

export interface CommitteeTask {
    code?:string;
    committeeId: 0,
    id?: 0,
    title: string,
    titleAr: string,
    createdBy: string,
    creatorInfo: UserInfo,
    creationDate: string,
    dueDate: string,
    importanceLevel: 0,
    assignedTo: string,
    assignedToInfo: UserInfo,
    mainTaskId: 0,
    attachmentsCount: 0,
    progress: 0,
    status: 0,
    commentsCount: 0,
    canChangeStatus?: boolean,
    comments: any[],
    attachments: any[],
    meeting: any,
    relatedGroups: string[],
    parentId: number,
}