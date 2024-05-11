import { IGoalItem } from "../Components/GoalItem/interfaces";
import { LevelMode, PerformanceStatusMode } from "../enum/enums";


export interface IAllScorecardsRes {
  canCreateNewScorecard: boolean;
  scorecards: IScorecard[]
}
export interface IScorecard {
  id: number;
  title: string;
  titleAr: string;
  excecutionYear: string;
  currentLevel: number;
  instances: groupInstance[]
}
export interface groupInstance {
  level: string;
  groups: scorecardGroup[]
}

export interface scorecardGroup {
  groupId: number;
  groupName: string;
  groupNameAr: string;
  status: string;
  submitable: boolean
}

export interface scorecardStatusResult {
  approvalInstance: any;
  planningInstance: IplanningInstance;
}
export interface IPlanning {
  canEditScorecard: boolean;
  id: number;
  canAddGeneralGoal: boolean;
  canChangeRequest: boolean;
  title: string;
  status: PerformanceStatusMode;
  currentLevel: LevelMode;
  submitable: boolean;
  moveToNextLevel: boolean;
  closeScorecard: boolean;
  closeScorecardApproval: boolean;
  submissionTotalWeight: number;
  goals: Array<IGoalItem>;
}

export interface IOption {
  id: number;
  titleEn: string;
  labelEn: string;
  isCommentRequired: boolean;
  commentTitleEn: string;
  isAttachmentRequired: boolean;
  isReassignOption: boolean;
  isActionVisibleExternally: boolean;
  buttonTag: string;
}

export interface IAction {
  titleEn: string;
  labelEn: string;
  commentTitleEn: string;
  comments: string;
  createdDate: string;
  attachments: Array<IAttachment>;
}

export interface IAttachment {
  fileName: string;
  extension: string;
}

// export interface IInstance {
//   id: number;
//   createdDate: string;
//   currentState: ICurrentPlanningStep;
//   hasTask: boolean;
//   hasForceActionPrivilege: boolean;
//   instanceStates: Array<IInstanceState>;
// }



export interface IGroup {
  groupId: number;
  groupName: string;
  groupNameAr: string;
  stepFlow: IStepFlow;
}
export interface IplanningInstance {
  totalCount: number;
  submitedCount: number;
  isSubmitted: boolean;
}

export interface IStepFlow {
  instanceId: string;
  states: any;
}


export interface ICurrentPlanningStep {
  id: number;
  code: string;
  titleEn: string;
  mappedStatusCode: string;
  isFinal: boolean;
}


export interface IchangedGoal {
  goalStatus: number;
  id: number;
  scorecardId: number;
  scorecardGroupId: number;
  goalTypeId: number;
  title: string;
  titleAr: string;
  level: number;
  formula: string;
  risk: string;
  achievementRequirements: string;
  groupId: number;
  ownerId: string;
  measurementMethod: number;
  parentId: number;
  frequency: number;
  attachments: {
    fileName: string;
    extension: string;
  }[];
  isBaseline: boolean;
  isCentralizedKPI: boolean;
  isParentLinkedToChildren: boolean;
  isMaintainTargetForFrequency: boolean;
  internalWeight: number;
  contributionWeight: number;
  initial: number;
  totalTarget: number;
  monthlyTarget: {
    janValue: number;
    janSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
    febValue: number;
    febSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
    marValue: number;
    marchSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
    aprValue: number;
    aprSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
    mayValue: number;
    maySubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
    junValue: number;
    junSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
    julValue: number;
    julSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
    augValue: number;
    augSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
    sepValue: number;
    sepSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
    octValue: number;
    octSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
    novValue: number;
    novSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
    decValue: number;
    decSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
  };
  quarterTarget: {
    firstQuarterValue: number;
    firstQuarterSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
    secondQuarterValue: number;
    secondQuarterSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
    thirdQuarterValue: number;
    thirdQuarterSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
    fourthQuarterValue: number;
    fourthQuarterSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
  };
  biYearlyTarget: {
    fisrtHalf: number;
    firsttHalfSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
    secondHalf: number;
    secondHalfSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
  };
  yearlyTarget: {
    value: number;
    yearSubmission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
  };
  dateGoalTarget: {
    kpiDate1: string;
    kpiDate2: string;
    submission: {
      actualValue: string;
      comment: string;
      attachments: string;
      correctiveAction: string;
    };
  };
}
