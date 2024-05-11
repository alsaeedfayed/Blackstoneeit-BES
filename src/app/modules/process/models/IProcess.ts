import { IConsumer } from "./IConsumer";
import { IForceActionRoles } from "./IForceActionRoles";
import { IForceActionType } from "./IForceActionType";
import { IForceActionUSer } from "./IForceActionUser";
import { IProcessStatus } from "./IProcessStatus";
import { IRole } from "./IRole";

export interface IProcess {
    id?: number;
    title: { en: string, ar: string };
    description: { en: string, ar: string };
    createdDate: Date;
    updatedDate: Date;
    structuredPermissions: any[];
    structuredPermissionsAr: any[];
    cancelOptionTag: string;
    cancelState: any; /*TODO*/
    consumer: IConsumer;
    externalStates: string[];
    forceActionOptionTag: string;
    isReassignOptionUsed: boolean;
    reassignOptionTag: string;
    isForceActionUsed: boolean;
    isEnabled: boolean;
    isCancelOptionUsed: boolean;
    sla: number;
    states: IProcessStatus[];
    forceActionType: IForceActionType;
    forceActionUsers: IForceActionUSer[];
    forceActionRoles: IRole[];
}
