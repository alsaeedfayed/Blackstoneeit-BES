import { IDecisionVotingAnswer } from "./IDecisionVotingAnswer";

export interface IDecisionVoting {
    id?: number;
    decisionId?: number;
    votingId: number;
    closingDate: string;
    decisionVotingAnswers?: IDecisionVotingAnswer[]
}


