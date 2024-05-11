export enum LevelMode {
    L0 = 1,
    L1 = 2,
    L2 = 3,
    L3 = 4
}

export enum PerformanceStatusMode {
    notStarted = 0,
    Planning = 1,
    Approval = 2,
    Completed = 3
}

export enum GoalFrequencyMode {
    NA = 0,
    Monthly = 1,
    Quarterly = 2,
    Biyearly = 3,
    Yearly = 4,
    SubGoals = 5
}

export enum GoalSubmissionValueFrequencyMode {
    M1 = 1,
    M2 = 2,
    M3 = 3,
    M4 = 4,
    M5 = 5,
    M6 = 6,
    M7 = 7,
    M8 = 8,
    M9 = 9,
    M10 = 10,
    M11 = 11,
    M12 = 12,
    Q1 = 13,
    Q2 = 14,
    Q3 = 15,
    Q4 = 16,
    HY1 = 17,
    HY2 = 18,
    Y1 = 19,
}

export enum MeasurementMethodMode {
    Percentage = 1,
    Value = 2,
    YesOrNo = 3,
    Currency = 4,
    SubGoal = 5,
    DateKpi = 6
}
export enum GoalTypeType {
    Informational = 1,
    Measurable = 2
}

export enum GoalChangeStatus  {
  addedGoal = 1,
  editedGoal= 2,
  removedGoal = 3,
  NoChange = 4
}
