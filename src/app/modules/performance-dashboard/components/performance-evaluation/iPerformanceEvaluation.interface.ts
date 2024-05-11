export interface IPerformanceEvaluationData {
    periodsPerformance: Array<IEvaluationData>;
}

export interface IEvaluationData {
    period: number;
    actual: number;
    target: number;
    performance: number;
}