import { UserInfo } from './../../models/UserInfo';
export interface IUpcomingMeeting {
        id: number;
        name: string;
        date: string;
        timeFrom: string;
        timeTo: string;
        status: number;
        createdBy: string;
        creatorInfo?: UserInfo;
}