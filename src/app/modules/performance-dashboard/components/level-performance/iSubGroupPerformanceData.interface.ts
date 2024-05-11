export interface ISubGroupPerformanceData {
    subGroups: Array<ISubGroup>;
}

export interface ISubGroup {
    actual: number;
    target: number;
    performance: number;
    group: IGroup;
}

export interface IGroup {
    id: number;
    name: string;
    arabicName: string;
    path: string;
    level: number;
    children: Array<IGroup>;
    parent: string;
    code: string;
}