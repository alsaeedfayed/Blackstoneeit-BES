export interface IProcessStatus {
    code: any;
    createdDate: Date;
    displayOrder: number;
    id: number;
    isDefaultFlow: boolean;
    isFinal: boolean;
    isInitial: boolean;
    isSLAOn: boolean;
    mappedStatusCode: string;
    processId: number;
    title: { en: string, ar: string };
    transitions: any[];
    updatedDate: Date;
}
