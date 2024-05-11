export interface IConsumer {
    id?: number;
    name: { en: string, ar: string };
    code: string;
    dynamicRoles: any[];
}