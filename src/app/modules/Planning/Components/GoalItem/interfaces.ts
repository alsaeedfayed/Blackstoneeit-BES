import { GoalTypeType, LevelMode } from '../../enum/enums';

export interface IGoalItem {
  id: number;
  title: string;
  titleAr: string;
  level: LevelMode;
  groupId: number;
  group: IGroup;
  goalTypeId: number;
  goalType: IGoalType;
  parent: string;
  children: Array<IGoalItem>;
  parentId: number;
  editable: boolean;
  addSubGoal:boolean;
  deletable: boolean;
  isSubmitted: boolean;
  isBaseline:boolean;
  frequency: any;
  measurementMethod: any;
  totalTarget: any;
  internalWeight: any;
  goalStatus?:number;
  formula?: string;
  risk?: string;
  achievementRequirements?: string;
  //hasPercentage: boolean;
  //percentageText: string;
  // percentageColor: string;
  // percentData?: IGoalItemPercentData;
  // hasChildren: boolean;
  // texts: Array<IText>;
}
export interface IGoalView {
  id: string;
  goalTypeId: string;
  title: string;
  titleAr: string;
  description: string;
  formula: string;
  risk: string;
  isBaseline:boolean;
  isCentralizedKPI:boolean;
  achievementRequirements: string;
  goalAttachments: { fileName: string; extension: string }[];
  level: string;
  groupId: string;
  ownerId: string;
  parentId: string;
  measurementMethod: string;
  initial: string;
  totalTarget: string;
  isParentLinkedToChildren: boolean;
  isMaintainTargetForFrequency:boolean;
  frequency: string;
  monthlyTarget: string;
  quarterTarget: string;
  biYearlyTarget: string;
  yearlyTarget: string;
  kpiDatestring: string;
  dateGoalTarget: { kpiDate1: string, kpiDate2:string },
  internalWeight: string;
  contributionWeight: number;
  hasChildren?: boolean
}

export interface IText {
  text: string;
  color: string;
}

export interface IGoalType {
  name: string;
  arabicName: string;
  nameSecondLanguage: string;
  description: string;
  color: string;
  type: GoalTypeType;
  category: number;
}

export interface IGroup {
  id: number;
  name: string;
  arabicName: string;
  code: string;
  level: LevelMode;
}

export interface IGoalItemPercentData {
  yearlyTarget: string;
  duePeriod: string;
  periodTarget: string;
  periodActual: string;
  targetTd: string;
  actualTd: string;
  isStable: boolean;
  totalPercent?: string;
}
