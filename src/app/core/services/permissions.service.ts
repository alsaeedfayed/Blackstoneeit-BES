import { Injectable } from "@angular/core";

@Injectable()
export class PermissionsService {

    public readonly serviceCatalogue_View: number = 3001;
    public readonly serviceCatalogueFavourite = 3002;
    public readonly serviceCatalogueStartService = 3003;
    public readonly serviceCatalogueRate = 3004;
    public readonly manageServicesView = 3005;
    public readonly manageServicesPublish = 3006;
    public readonly manageServicesCreate = 3007;
    public readonlyMyRequests_View = 3008;
    public readonlyMyRequests_Details = 3009;
    public readonlyMyRequests_Attention = 3010;
    public readonlyManageForms_View = 3011;
    public readonlyManageForms_Activate = 3012;
    public readonlyManageForms_Create = 3013;
    public readonly AgentQueue_View = 3014;
    public readonly agentQueue_Details = 3015;

    constructor() {}

}