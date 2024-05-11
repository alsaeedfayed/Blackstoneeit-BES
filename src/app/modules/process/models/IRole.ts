export interface IRole {
    id?: string;
    name: string;
    nameAr: string;
    creationDate: Date;
    structuredPermissions: any[];
    structuredPermissionsAr: any[];
}