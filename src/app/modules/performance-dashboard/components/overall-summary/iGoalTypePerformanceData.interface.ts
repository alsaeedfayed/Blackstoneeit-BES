export interface IGoalTypePerformanceData {
    types: Array<IGoalTypePerformance>,
    breakdown: Array<IBreakdown>
}

export interface IGoalTypePerformance {
    type: IGoalType;
    goals: Array<IGoal>;
}

export interface IGoalType {
    id: number;
    name: string;
    arabicName: string;
    description: string;
    color: string;
    category: number;
    isEnabled: boolean;
}

export interface IGoal {
    goalId:  number;
    title: string;
    titleAr: string;
    progress: number;
    type: number;
}

export interface IBreakdown {
    goalId: number;
    title: string;
    titleAr: string;
    type: number;
    status: number;
    progress: number;
    open: boolean;
    childrenGoals: Array<IBreakdown>;
}