import { ICommitteeInfo } from "../../../models/ICommitteeInfo";
import { UserInfo } from "../../../models/UserInfo";
import { IWorkgroupObjective } from "./IWorkgroupObjective";

export interface IWorkgroup {
    id: number;
    committeeId: number;
    committee: ICommitteeInfo;
    creationDate: Date;
    name: string;
    creatorInfo: UserInfo;
    members: UserInfo[];
    objectives: IWorkgroupObjective;
    canEditWorkgroup: boolean;
    membersCount: number;
    status:number;
}


