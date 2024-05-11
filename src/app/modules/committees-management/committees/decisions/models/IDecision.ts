import { ICommitteeInfo } from "../../../models/ICommitteeInfo";
import { UserInfo } from "../../../models/UserInfo";
import { IDecisionVoting } from "./IDecisionVoting";
import { IDecisionWorkgroup } from "./IDecisionWorkgroup";

export interface IDecision {
    id: number;
    committeeId: number;
    committeeInfo: ICommitteeInfo;
    name: string;
    nameAr: string;
    notes: string;
    type: string;
    status: number;
    yesPercentage: number;
    noPercentage: number;
    creatorInfo: UserInfo;
    decisionVotings?: IDecisionVoting[];
    decisionVoting?: IDecisionVoting;
    decisionWorkgroups?: IDecisionWorkgroup[];
    decisionWorkgroup?: IDecisionWorkgroup;
    workgroupId?: number;
    votingType?: number;
    memberIds: string[];
    closingDate: string;
    votingTemplate: number;
    creationDate: string;
    attachments: any[];
    meetingId?: number;
    canEdit?: boolean;
    disableVotingTemplate: boolean;
    canSend:boolean;
    tags : any[]
}


