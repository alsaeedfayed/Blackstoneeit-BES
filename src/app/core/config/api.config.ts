import { environment } from "src/environments/environment";

export class Config {
  //server
  public static apiUrl = environment.serverUrl

  // Identity
  public static Identity = {
    RefreshToken: '/Identity/api/Identity/RefreshToken',
  }

  // License
  public static License = {
    CheckLicense: '/api/FeatureManager/CheckLicence'
  }


  //User Management
  public static UserManagement = {
    GetAll: "/UserManagement/api/User/GetAll",
    GetUsersByIds: "/UserManagement/api/User/GetUsersByIds",
    getOwners: "/UserManagement/api/User/GetOwners",
    updateUser: "/UserManagement/api/User/Update",
    updateProfilePicture: "/UserManagement/api/User/UpdateProfilePicture",
    GroupId: "/UserManagement/api/User/User/Get/GroupId",
    UsersFullName: "/UserManagement/api/User/GetUsersByFullName",
  };


  public static Committees = {
    Get: '/UserManagement/api/Committees/Get',
    GetAll: '/UserManagement/api/Committees/Get/All',
    GetAllActive: '/UserManagement/api/Committees/GetAll',
    Activate: '/UserManagement/api/Committees/Activate/{id}/{status}',
    Delete: '/UserManagement/api/Committees/Delete/{id}',
    Create: '/UserManagement/api/Committees/Create',
    Update: '/UserManagement/api/Committees/Update',
    Members: '/UserManagement/api/Committees/Get/Members/',
  }

  // Groups
  public static Groups = {
    Get: '/UserManagement/api/Groups/Get',
    GetAll: '/UserManagement/api/Groups/GetAll',
    GetAllGroups: '/UserManagement/api/Groups/GetAllGroups',
    GetPagedGroups: "/UserManagement/api/Groups/GetPagedGroups",
    GetGroups: '/UserManagement/api/Groups/GetGroups',
    GetUserGroup: '/UserManagement/api/User/User/Get/GroupId',
    GetMyGroups: '/UserManagement/api/Groups/GetMyGroups',
  }

  //Service
  public static Service = {
    createService: '/ServiceDesk/api/Service/Create',
    updateService: '/ServiceDesk/api/Service/Update',
    getAllService: '/ServiceDesk/api/Service/GetAll',
    getService: '/ServiceDesk/api/Service/Get',
    toggleActivate: '/ServiceDesk/api/Service/ToggleActivate',
    Perform: '/ServiceDesk/api/Workflow/Perform',
    GetStates: '/ServiceDesk/api/Workflow/Instance/States',
    ReassignTask: '/ServiceDesk/api/Workflow/Task/Reassign',
    Override: '/ServiceDesk/api/Workflow/Force/Perform',
    CancelReassignTask: '/ServiceDesk/api/Workflow/Task/Reassign/Cancel',
    CancelReassignTaskMeeting:
      '/ServiceDesk/api/Workflow/Task/Reassign/Cancel/Meeting',
    CancelRequest: '/ServiceDesk/api/WorkFlow/Cancel/Perform',
  }

  //Service
  public static EService = {
    getAllEService: '/ServiceDesk/api/EService/All',
    // createEService: '/ServiceDesk/api/EService/Create',
    updateEService: '/ServiceDesk/api/EService/Update',
    moveEService: '/ServiceDesk/api/EService/Move',
    deleteEService: '/ServiceDesk/api/EService/Delete',
    getEService: '/ServiceDesk/api/EService/Details/',
    exportEServices: '/ServiceDesk/api/EService/Export',
  };

  //Services Catalogues
  public static ServicesCatalogues = {
    getAllServicesCatalogues: '/ServiceDesk/api/ServiceCatalogue/Get',
    toggleFavourite: '/ServiceDesk/api/ServiceCatalogue/SetFavourite',
    setRating: '/ServiceDesk/api/ServiceCatalogue/SetRating',
    getFavouritesServices: '/ServiceDesk/api/ServicesCatalogues/GetFavourites',
    getCategories: '/ServiceDesk/api/ServiceCatalogue/GetCategories'
  }

  //Mange Scorecards
  public static MangeScorecards = {
    getAll: "/Performance/api/Scorecard/View",
    updatescorecard: "/Performance/api/Scorecard/Update",
    setCurrent: "/Performance/api/Scorecard/SetCurrent",
    delete: "/Performance/api/Scorecard/Delete/{id}",
    getWithDetails: "/Performance/api/Scorecard/GetWithDetails/{id}",
    startScorecard: "/Performance/api/Scorecard/Start",
    getStatusDetails: "/Performance/api/Scorecard/StatusDetails",
    getYearGoals: "/Performance/api/Goal/CurrentYearGoals",
    selectedItems: '/Performance/api/Scorecard/GetTree/SelectedItems'
  };

  //Lookups
  public static Lookups = {
    lookupService: '/Utilities/api/Lookup/GetAll',
    GetByLookupType: "/Utilities/api/Lookup/Get",
    changeLookupStatus: '/Utilities/api/Lookup/UpdateStatus',
    deleteLookup: '/Utilities/api/Lookup/Delete',
    updateLookup: '/Utilities/api/Lookup/Update',
    createlookup: '/Utilities/api/Lookup/Create',
    createTranslation: '/Utilities/api/Translator/Translate',
    lookupProcess: '/WorkflowEngine/api/Process/Enabled/Search',
    lookupAgent: '/UserManagement/api/User/GetAgents',
    lookupGroups: '/UserManagement/api/Groups/Get',
    lookupRoles: '/UserManagement/api/Role/GetAll',
    lookupForms: '/ServiceDesk/api/FormBuilder/GetAllForms',
    lookupGoalTypes: '/GoalEngine/api/GoalType/Get',
    lookupEnabledGoalTypes: '/GoalEngine/api/GoalType/Get/Enabled',
    lookupPerformanceGroups: '/Performance/api/Scorecard/Groups',
    getMyHierarchy: '/UserManagement/api/User/Get/MyHierarchy',
    getExternalLookups: '/Eppm/api/Lookup/Project/ExternalLookups',
    getDepartments: '/Eppm/api/Lookup/Project/GetDepartments',
    getSections: '/Eppm/api/Lookup/Project/GetAreas',
    getPriorityLevels: '/Eppm/api/Lookup/Project/PriorityLevels',
    getProjectStatus: '/Eppm/api/Lookup/Project/Status',
    getDelegationStatus: '/WorkflowEngine/api/Lookup/DelegationStatus',
    getLookupRoles: '/Utilities/api/LookupRole/Get',
    createLookupRole: '/Utilities/api/LookupRole/Create',
    removeLookupRole: '/Utilities/api/LookupRole/Delete',
    getLooktypeByServiceName: '/Utilities/api/Lookup/Get/',
    GetRolesByIds: '/UserManagement/api/Role/GetRolesByIds',
    locationLookup: "/Utilities/api/Lookup/Get/Locations?ServiceName=ServiceDesk",
    decisionType: "/Utilities/api/Lookup/Get/DecisionType?ServiceName=Committee",
    getLookupId: "/Utilities/api/Lookup/Get/Id",
    getLookupCode: "/Utilities/api/Lookup/GetByCode",
    getDynamicAPIs: "/Utilities/api/Api/Get",
    getConsumers: "/WorkflowEngine/api/Lookup/GetConsumers",
    getGetGroupByLevel: "/UserManagement/api/Groups/GetGroupByLevel",
    getGroupById: "/UserManagement/api/Groups/GetById"
  };


  //Requests
  public static requests = {
    getAll: '/ServiceDesk/api/Requests/GetRequests',
    SubmitRequest: '/ServiceDesk/api/Requests/SubmitRequest',
    getHistory: '/ServiceDesk/api/Requests/GetHistory',
    GetStatus: '/ServiceDesk/api/Requests/GetStatus',
    UpdateRating: '/ServiceDesk/api/Requests/UpdateRating',
    GetCount: '/ServiceDesk/api/Requests/GetCount',
    GetComments: "/ServiceDesk/api/Requests/GetComments/",
    AddComment: "/ServiceDesk/api/Requests/Comment",
    DeleteComment: "/ServiceDesk/api/Requests/DeleteComment/",
    UpdateRequest: "/ServiceDesk/api/Requests/UpdateRequest"
  }

  // Form Builder
  public static FormBuilder = {
    GetAll: '/ServiceDesk/api/FormBuilder/Get',
    GetAllForms: '/ServiceDesk/api/FormBuilder/GetAllForms',
    CreateForm: '/ServiceDesk/api/FormBuilder/CreateForm',
    GetServiceForm: '/ServiceDesk/api/FormBuilder/GetServiceForm',
    ToggleActivate: '/ServiceDesk/api/FormBuilder/ToggleActivate',
    GetDynamicFormById: "/ServiceDesk/api/FormBuilder/GetDynamicFormById",
    UpdateDynamicForm: "/ServiceDesk/api/FormBuilder/UpdateDynamicForm",
    CreateDynamicForm: "/ServiceDesk/api/FormBuilder/CreateDynamicForm",
  };

  // Performance
  public static Performance = {
    getAll: "/Performance/api/Scorecard/Get/",
    getGoal: "/Performance/api/Goal/Get",
    getGoalView: "/Performance/api/Goal/View",
    getScorecardAll: "/Performance/api/Scorecard/All",
    createGoal: "/Performance/api/Goal/Create",
    updateGoal: "/Performance/api/Goal/Update",
    deleteGoal: "/Performance/api/Goal/Delete",
    GetStatus: "/Performance/api/Scorecard/GetStatus",
    sumbitScoreCard: "/Performance/api/Scorecard/Submit",
    MoveToNextLeveL: "/Performance/api/Scorecard/MoveToNextLevel/",
    CloseApprovalCycle: "/Performance/api/Scorecard/closeApprovalCycle/",
    GetMyActions: "/Performance/api/Scorecard/GetMyActions",
    Perform: "/Performance/api/Workflow/Perform",
    SubmissionPeriod: "/Performance/api/SubmissionPeriod/GetAll",
    GetSubmissionPeriod: "/Performance/api/SubmissionPeriod/Get",
    GetGoalForUpdate: "/Performance/api/Goal/GetForUpdate/",
    GetCurrent: "/Performance/api/Scorecard/GetCurrent",
    UpdateProgress: "/Performance/api/Goal/UpdateProgress",
    GetMyLevels: "/Performance/api/Scorecard/GetLevels",
    GetMyGroups: "/Performance/api/Scorecard/Groups",
    GetInformativeGoals: "/Performance/api/Goal/GetInforamtiveGoals",
    GetPeriodGoals: "/Performance/api/ScorecardSubmission/GetPeriodGoals",
    GetPerformance: "/Performance/api/ScorecardSubmission/GetPerformance",
    OpenPeriod: "/Performance/api/ScorecardSubmission/Set/{index}",
    Export: "/Performance/api/ScorecardSubmission/Export",
    GetPerformanceEvaluation: '/Performance/api/ScorecardSubmission/GetYearEvaluation',
    canClose: '/Performance/api/Scorecard/CanClose',
    getMyHirechy: '/UserManagement/api/User/Get/Performance/MyHierarchy',
    submittionStatusDetails: '/Performance/api/ScorecardSubmission/Submission/Status',
    submit: "/Performance/api/ChangeRequestStorecard/Submit",
    GetActions: "/Performance/api/ChangeRequestStorecard/GetMyActions",
    GetDetails: "/Performance/api/ChangeRequestStorecard/View",
    getRelatedChangeRequests: '/Performance/api/ChangeRequestStorecard/GetRelatedChangeRequests',
    getChangerequestGoals: '/Performance/api/Goal/Get/ChangeRequestGoals',
    getGoalsByLevelAndGroup: '/Performance/api/Goal/Get',
    updateScorecard: '/Performance/api/ChangeRequestStorecard/Update',
    GetCount: '/Performance/api/ChangeRequestStorecard/GetCount',
    GetInformativeByYear: "/Performance/api/Scorecard/GetInformative",
    GetTree: "/Performance/api/Scorecard/GetTree",
  }

  // Performance Dashboard
  public static PerformanceDashboard = {
    GetPerformanceTodate: '/Performance/api/Dashboard/GetPerformanceTodate',
    GetGoalTypePerformance: '/Performance/api/Dashboard/GetGoalTypePerformance',
    GetSubgroupPerformance: '/Performance/api/Dashboard/GetSubgroupPerformance',
    GetYearPerformance: '/Performance/api/Dashboard/GetYearPerformance',
  }

  // Agent Queue
  public static AgentQueue = {
    GetAll: '/ServiceDesk/api/Agent/GetAll',
    export: '/ServiceDesk/api/Agent/ExportAgentList',
    GetCount: '/ServiceDesk/api/Agent/GetCount',
  }

  // File Service
  public static fileService = {
    upload: '/FileService/api/Attachment/Upload',
    getFilesUrls: '/FileService/api/File/Urls',
    downloadFile: '/FileService/api/Attachment/DownloadFile',
  }

  // Profile
  public static Profile = {
    getProfile: '/UserManagement/api/Profile/Get',
  }

  // Configuration
  public static Configuration = {
    GetAll: '/Performance/api/Configuration/StatusWindow/GetAll',
    updateConfiguration: '/Performance/api/Configuration/StatusWindow/Edit',
    GetAllGoal: '/GoalEngine/api/GoalType/Get',
    GetEnabledGoal: '/GoalEngine/api/GoalType/Get/Enabled',
    toggleEnabled: '/GoalEngine/api/GoalType/Enable',
  }



  // Dashboard
  public static Dashboard = {
    GetProjectsStatistics: '/Eppm/api/Statistics/Projects',
    GetBudgetStatistics: '/Eppm/api/Statistics/Budget',
    GetProjectManagers: '/Eppm/api/Statistics/ProjectManagers',
    GetSectorsData: '/Eppm/api/Statistics/Sectors',
    GetDepartments: '/Eppm/api/Statistics/Departments',
    GetSectors: '/Eppm/api/Lookup/Project/GetSectors',
    GetPriorities: '/Eppm/api/Statistics/Projects/Priorities',
    GetCategories: '/Eppm/api/Statistics/Projects/Categories',
    GetOrigins: '/Eppm/api/Statistics/Projects/Origins',
    GetDeliverables: '/Eppm/api/Statistics/Deliverables',
    GetHighRisks: '/Eppm/api/Dashboard/HighRisks',
    GetDetails: '/Eppm/api/Dashboard/Projects/Details',
    GetTotalBudgetAndSpent: '/Eppm/api/Statistics/Budget/PlannedAndActual',
    GetMainTaskStatus: "/Committees/api/Dashboard/MainTaskStatus",
    GetTaskStatusList: "/Committees/api/Dashboard/TaskStatusList",
    GetKpiStatistics: "/Committees/api/Dashboard/KpiStatistics",
    GetKpiStatisticsList: "/Committees/api/Dashboard/KpiStatisticsList",
    ExportKPIs: "/CommitteeKpi/Export",
  }

  // Scorecard Submission
  public static ScorecardSubmission = {
    GetScorecardSubmission: "/Performance/api/ScorecardSubmission/Get",
    SubmitScorecard: "/Performance/api/ScorecardSubmission/Submit",
    Extend: "/Performance/api/ScorecardSubmission/Extend",
    Close: "/Performance/api/ScorecardSubmission/Close",
    Publish: "/Performance/api/SubmissionPeriod/Publish",
  };

  // Chnage Requests
  public static chnageRequest = {
    getAllCR: "/Committees/api/ChangeRequest/Get",
    getStatistics: "/Committees/api/ChangeRequest/Statistics",
    getAll: "/Performance/api/ChangeRequestStorecard/View",
    submit: "/Performance/api/ChangeRequestStorecard/Submit",
    GetStatus: "/Performance/api/ChangeRequestStorecard/GetStatus",
    GetActions: "/Performance/api/ChangeRequestStorecard/GetMyActions",
    GetDetails: "/Performance/api/ChangeRequestStorecard/View",
    getRelatedChangeRequests:
      "/Performance/api/ChangeRequestStorecard/GetRelatedChangeRequests",
    getChangerequestGoals: "/Performance/api/Goal/Get/ChangeRequestGoals",
    getGoalsByLevelAndGroup: "/Performance/api/Goal/Get",
    updateScorecard: "/Performance/api/ChangeRequestStorecard/Update",
    GetCount: "/Performance/api/ChangeRequestStorecard/GetCount",
    GetKpisDetails: '/Committees/api/CommitteeKpi/GetById',
    GetTasksDetails: '/Committees/api/MainTask/GetById'
  };

  // Scorecard
  public static scorecard = {
    create: "/Performance/api/Scorecard/Create",
    GetGoalsToLevel: "/Performance/api/Scorecard/GetGoalsToLevel",
    GetCount: "/Performance/api/Scorecard/GetCount",
  };

  // Notification
  public static Notification = {
    GetCount: '/Utilities/api/Notification/Notification/Count',
    GetNotifications: '/Utilities/api/Notification/Notification/Get',
    ReadNotification: '/Utilities/api/Notification/Notification/Read',
  }
  // Goal Types
  public static GoalTypes = {
    create: '/GoalEngine/api/GoalType/Create',
    update: '/GoalEngine/api/GoalType/Update',
    delete: '/GoalEngine/api/GoalType/Delete',
    updateEnable: '/GoalEngine/api/GoalType/Enable',
  }


  // Meetings
  public static meetings = {
    getStats: '/ServiceDesk/api/Meeting/GetStatitics',
    getAll: '/ServiceDesk/api/Meeting/View',
    getMyActions: '/ServiceDesk/api/Meeting/GetMyActions',
    getStatus: '/ServiceDesk/api/Meeting/GetStatus',
    save: '/ServiceDesk/api/Meeting/Save',
    delete: '/ServiceDesk/api/Meeting/Delete',
    submit: '/ServiceDesk/api/Meeting/Submit',
    exportPDF: '/ServiceDesk/api/Meeting/ExportPDF',
    exportExcel: '/ServiceDesk/api/Meeting/ExportExcel',
    GetCount: '/ServiceDesk/api/Meeting/GetCount',
    attendees: {
      create: '/ServiceDesk/api/Attendee/Create',
      update: '/ServiceDesk/api/Attendee/Update',
      get: '/ServiceDesk/api/Attendee/View',
      delete: '/ServiceDesk/api/Attendee/Delete',
      getAttendees: '/ServiceDesk/api/Attendee/Get',
    },
    discussionItems: {
      create: '/ServiceDesk/api/DiscussionItem/Create',
      update: '/ServiceDesk/api/DiscussionItem/Update',
      get: '/ServiceDesk/api/DiscussionItem/View',
      delete: '/ServiceDesk/api/DiscussionItem/Delete',
    },
    actionItems: {
      create: '/ServiceDesk/api/ActionItem/Create',
      update: '/ServiceDesk/api/ActionItem/Update',
      get: '/ServiceDesk/api/ActionItem/View',
      getById: '/ServiceDesk/api/ActionItem/Get',
      delete: '/ServiceDesk/api/ActionItem/Delete',
    },
  }
  public static delegations = {
    getAll: '/WorkflowEngine/api/Delegation/Search',
    get: '/WorkflowEngine/api/Delegation/Get',
    create: '/WorkflowEngine/api/Delegation/Add',
    cancel: '/WorkflowEngine/api/Delegation/Cancel',
    update: '/WorkflowEngine/api/Delegation/Update',
  }

  //FollowUp
  public static FollowUp = {
    Get: '/ServiceDesk/api/Followup/Get',
    GetMyHirerchy: '/ServiceDesk/api/User/GetMyHirerchy',
    UpdateProgress: '/ServiceDesk/api/ActionItem/UpdateProgress',
    GetActionItem: '/ServiceDesk/api/ActionItem/Get',
    Create: '/ServiceDesk/api/ActionItem/Create',
    Update: '/ServiceDesk/api/ActionItem/Update',
    closeTask: '/ServiceDesk/api/ActionItem/Close',
    ExportExcel: '/ServiceDesk/api/Followup/ExportExcel',
    reopenTask: '/ServiceDesk/api/ActionItem/Reopen',
    transferTask: '/ServiceDesk/api/ActionItem/Transfer',
    GetCount: '/ServiceDesk/api/Followup/GetCount',
    GetCardsCount: '/ServiceDesk/api/Followup/GetSummary',
  }

  public static Projects = {
    ExportRequests: '/Eppm/api/Project/Request/Export',
    GetCount: '/Eppm/api/Project/Request/GetCount',
    GetApprovedCount: '/Eppm/api/Project/GetPendingCount',
    GetClosureRequestsCount: '/Eppm/api/Project/Closure/GetCount',
    AddExternalStakeholder: '/Eppm/api/Project/ExternalStakeholder/Add',
    RemoveExternalStakeholder: '/Eppm/api/Project/ExternalStakeholder/Remove',
    AddTeamMembers: '/Eppm/api/Project/TeamMembers/Update',
    GetChangeRequestsCount: '/Eppm/api/ChangeRequest/GetCount',
  }

  //SerServices & Requests - Dashboard
  public static servicesDashboard = {
    GetRequestsStatics: '/ServiceDesk/api/Dashboard/Requests/StatusStatistic',
    GetClosureRate: '/ServiceDesk/api/Dashboard/Requests/ClosureRate',
    GetCategoriesSLA: '/ServiceDesk/api/Dashboard/Requests/CategoriesSLAs',
    GetRequestsTrackingCharts:
      '/ServiceDesk/api/Dashboard/Requests/SLAStatistic',
    GetServicesDistributions:
      '/ServiceDesk/api/Dashboard/Requests/ServicesDistributions',

    //followUp
    GetFolloUpPerQuartar: '/ServiceDesk/api/Dashboard/FollowUps/PerQuarter',
    GetMeetingsPerQuartar: '/ServiceDesk/api/Dashboard/Meetings/PerQuarter',
    GetFollowUpTrackingChart:
      '/ServiceDesk/api/Dashboard/FollowUps/ProgressTracking',
    GetFollowUpItems: '/ServiceDesk/api/Dashboard/FollowUps/StatusStatistic',
    GetFollowUpClosureRate: '/ServiceDesk/api/Dashboard/FollowUps/ClosureRate',
    GetFollowUpLoadedEmp:
      '/ServiceDesk/api/Dashboard/FollowUps/TopLoadedEmployees',
    GetFollowUpMeetingsStatus:
      '/ServiceDesk/api/Dashboard/Meetings/StatusStatistic',
  }


  // Committees
  public static CommitteesManagement = {
    GetAll: "/Committees/api/Committees/Get",
    GetList: "/Committees/api/Committees/GetList",
    GetApproved: "/Committees/api/Committees/GetApproved",
    GetCommittees: "/Committees/api/Committees/GetAll",
    GetCommitteeDetails: "/Committees/api/Committees/Get",
    GetStatus: "/Committees/api/Committees/GetStatus",
    GetActions: "/Committees/api/Committees/GetMyActions",
    SaveDraft: "/Committees/api/Committees/SaveDraft",
    Save: "/Committees/api/Committees/Save",
    SendRequest: "/Committees/api/Committees/SendRequest",
    DeleteRequest: "/Committees/api/Committees/Delete",
    GetUsers: "/Committees/api/Committees/Users/{id}",
    ExportDecision: "/Committees/api/Committees/ExportDecision",
    AllowedToCR: "/Committees/api/ChangeRequest/CanCreate",
    GetCRById: "/Committees/api/ChangeRequest/Get",
    GetCRDetails: "/Committees/api/ChangeRequest/Details",
    ExportCR: "Committees/api/ChangeRequest/ExportDecision",
    GetDecisionText: "/Committees/api/Committees/DecisionText",

  };
  public static CommitteeModifyRequests = {
    SaveDraft: "/Committees/api/ChangeRequest/SaveDraft",
    Save: "/Committees/api/ChangeRequest/Save",
    SendRequest: "/Committees/api/ChangeRequest/SendRequest",
  };
  public static CommitteeKpi = {
    GetAllByCommitteeId: "/Committees/api/CommitteeKpi/Get",
    GetById: "/Committees/api/CommitteeKpi/GetById",
    Create: "/Committees/api/CommitteeKpi/Create",
    Update: "/Committees/api/CommitteeKpi/Update",
    Delete: "/Committees/api/CommitteeKpi/Delete",
    UpdateProgress: "/Committees/api/CommitteeKpi/UpdateProgress",
    ExportExcel: "/Committees/api/CommitteeKpi/Export",
  };

  public static committeeMembers = {
    GetCommitteeMembers: "/Committees/api/Committees/GetCommitteeMembers",
  }

  //committee evaluations

  public static CommitteeEvaluations = {
    GetAll: "/Committees/api/Audit/ViewAll",
    GetAudit: "/Committees/api/Audit/View",
    GetDetails: "/Committees/api/Audit/Details",
    ExportExcel: "/Committees/api/Audit/Export",
    Add: "/Committees/api/Audit/Add",
    Cancel: "/Committees/api/Audit/Cancel",
    CloseAndApprove: "/Committees/api/Audit/Close",
    Update: "/Committees/api/Audit/Update",
    membersPerformance : "/Committees/api/AuditDashboard/MemberPerformance"
  };

  public static EvaluationStatics = {
    Statistics: "/Committees/api/AuditDashboard/Statistics",
    Meetings: "/Committees/api/AuditDashboard/MeetingStatistics",
    KPIs: "/Committees/api/AuditDashboard/KpiStatistics",
    Tasks: "/Committees/api/AuditDashboard/MainTaskStatistics",
    ClosedStatistics: "/Committees/api/AuditDashboard/CloseStatistics",
  };
  public static CommitteeObservations = {
    Create: "/Committees/api/AuditObservation/Add",
    Close: "/Committees/api/AuditObservation/Close",
    Reopen: "/Committees/api/AuditObservation/Reopen",
    GetComments: "/Committees/api/AuditObservation/GetComments",
    AddComment: "/Committees/api/AuditObservation/Comment",
    DeleteComment: "/Committees/api/AuditObservation/DeleteComment",
  };
  public static CommitteeMainTask = {
    GetAllByCommitteeId: "/Committees/api/task/Get",
    GetById: "/Committees/api/MainTask/GetById",
  };

  //Work Groups
  public static WorkGroup = {
    Create: "/Committees/api/Workgroup/Create",
    Update: "/Committees/api/Workgroup/Update",
    GetAllByCommitteeId: "/Committees/api/Workgroup/Get",
    GetListByCommitteeId: "/Committees/api/Workgroup/Get/List",
    GetGroupDetails: "/Committees/api/Workgroup/Get/Id",
    ChangeStatus: "/Committees/api/Workgroup/ChangeStatus",
    GetgroupsNames: "/Committees/api/Workgroup/WorkgroupNames/",
  };

  // Decision
  public static Decision = {
    SaveDraft: "/Committees/api/Decision/SaveDraft",
    GetAllByCommitteeId: "/Committees/api/Decision/Get",
    GetById: "/Committees/api/Decision/Get/Id",
    GetInstanceId: "/Committees/api/Decision/Get/StatusDetails",
    Publish: "/Committees/api/Decision/Publish",
    Vote: "/Committees/api/Decision/Vote",
    ExportPDF: "/Committees/api/Decision/ExportPDF",
    GetMeeting: "/Committees/api/Decision/Get/Meeting",
    Send: "/Committees/api/Decision/Send",
    MessageHistory: "/Committees/api/Decision/MessageHistory",
    VotingHistory: "/Committees/api/Decision/VotingHistory",
    Confirm : "/Committees/api/Decision/Confirm"
  };

  //Meetings
  public static Meeting = {
    GetAllByCommitteeId: "/Committees/api/Meeting/Get",
    GetById: "/Committees/api/Meeting/Get/Id",
    SaveDraft: "/Committees/api/Meeting/SaveDraft",
    Publish: "/Committees/api/Meeting/Publish",
    SaveMom: "/Committees//api/Meeting/SaveMom",
    PublishForReview: "/Committees/api/Meeting/PublishForReview",
    Attendees: {
      Add: "/Committees/api/MeetingAttendee/Add",
      Update: "/Committees/api/MeetingAttendee/Update",
      GetAllByMeetingId: "/Committees/api/MeetingAttendee/Get",
      GetById: "/Committees/api/MeetingAttendee/Get/Id",
    },
    Comments: {
      GetByMeetingId: "/Committees/api/MeetingComment/Get/Meeting",
      Add: "/Committees/api/MeetingComment/Create",
      GetById: "/Committees/api/MeetingComment/Get/id",
    },
  };

  // Task
  public static Task = {
    GetAllByCommitteeId: "/Committees/api/Task/Get",
    GetById: "/Committees/api/Task/Get/Id",
    Create: "/Committees/api/Task/Create",
    Update: "/Committees/api/Task/Update",
    Delete: "/Committees/api/Task/Delete",
    GetMeeting: "/Committees/api/Task/Get/Meeting",
    GetByWorkGroupId: "/Committees/api/Task/Get/WorkGroup",
    ChangeStatus: "/Committees/api/Task/ChangeStatus",
    UpdateProgress: "/Committees/api/Task/UpdateProgress",
    ExportExcel: "/Committees/api/Task/ExportExcel",
    GetHistory: "/Committees/api/Task/GetHistory",
    GetFiles: "/Committees/api/Task/GetFiles",
    Comment: {
      Create: "/Committees/api/TaskComment/Create",
    },
  };
  public static DiscussionItem = {
    GetById: "/Committees/api/DiscussionItem/Get/Id",
    Create: "/Committees/api/DiscussionItem/Create",
    Update: "/Committees/api/DiscussionItem/Update",
    GetMeeting: "/Committees/api/DiscussionItem/Get/Meeting",
  };

  // VotingTemplate
  public static VotingTemplate = {
    Get: "/Committees/api/VotingTemplate/Get",
    GetById: "/Committees/api/VotingTemplate/Get",
    Create: "/Committees/api/VotingTemplate/Create",
    Update: "/Committees/api/VotingTemplate/Update",
    Delete: "/Committees/api/VotingTemplate/Delete",
  };

  // weight settings
  public static WeightSettings = {
    Get: "/Committees/api/WeightSettings/GetFirst",
    Update: "/Committees/api/WeightSettings/Update",

  };

  // Event
  public static Event = {
    GetAll: "/SSEM/api/Event/Search",
    GetById: "/SSEM/api/Event/Get",
    Create: "/SSEM/api/Event/Add",
    Cancel: "/SSEM/api/Event/Cancel",
    Delete: "/SSEM/api/Event/Delete",
    DeleteAttendee: "/SSEM/api/Event/Attendee/Delete",
    Rating: "/SSEM/api/Event/Attendee/Rating",
    CloseRating: "/SSEM/api/Event/Attendee/CloseRating",
    Registration: "/SSEM/api/Event/Registration",
    Statistics: "/SSEM/api/Event/Statistics",
  };

  // WorkflowEngine
  public static WorkflowEngine = {
    getProcessesByIds: "/WorkflowEngine/api/Process/GetProcessesByIds",
    // new APIs
    GetTask: "/WorkflowEngine/api/Task/Instance/Get",
    GetInstance: "/WorkflowEngine/api/Instance/Get",
    GetStates: "/WorkflowEngine/api/instance/States",
    Reassign: "/WorkflowEngine/api/Task/Reassign",
    ReassignCancel: "/WorkflowEngine/api/Task/Reassign/Cancel",
    Perform: "/WorkflowEngine/api/Action/Perform",
    Override: "/WorkflowEngine/api/Action/Force/Perform",
    PerformCancel: "/WorkflowEngine/api/Action/Cancel/Perform",
  };

  // Process
  public static Process = {
    GetAll: "/WorkflowEngine/api/Process/Search",
    Add: "/WorkflowEngine/api/Process/Add",
    Update: "/WorkflowEngine/api/Process/Update",
    Get: "/WorkflowEngine/api/Process/Get",
    Delete: "/WorkflowEngine/api/Process/ToggleActivation",
    ToggleEnable: "/WorkflowEngine/api/Process/ToggleEnable",
    ValidateTitle: "/WorkflowEngine/api/Process/ValidateTitle",
  };

  public static States = {
    Add: "/WorkflowEngine/api/State/Add",
    delete: "/WorkflowEngine/api/State/Delete"
  };

  public static CommitteeDashboard = {
    GetMyStatistics: "/Committees/api/Dashboard/MyStatistics",
    GetTasksStatuses: "/Committees/api/Dashboard/TaskStatus",
    GetUpComingMeetingToday: "/Committees/api/Dashboard/UpComingMeetingToday",
    GetActiveTwoTasks: "/Committees/api/Dashboard/ActiveTwoTasks",
    GetLatestFourDecisions: "/Committees/api/Dashboard/LatestFourDecision",
    GetActivePolls: "/Committees/api/Dashboard/ActivePolls",
    GetRecentActivities: "/Committees/api/Dashboard/RecentActivities",
    GetAttendanceRate: "/Committees/api/Dashboard/AttendanceRate",
  };


  public static committeesDashboard = {
    GetCommitteesTypes: "/Committees/api/Dashboard/CommitteesPerType",
    GetCommitteesCategories: "/Committees/api/Dashboard/CommitteesPerCategory",
    GetCommitteesCount: "/Committees/api/Dashboard/TotalCommitteesCount",
    GetTotalMeetingsCount: "/Committees/api/Dashboard/TotalMeetingsCount",
    GetTotalDecisionsCount: "/Committees/api/Dashboard/TotalDecisionsCount",
    GetTotalTasksCount: "/Committees/api/Dashboard/TotalMainTasksCount",
    GetCommitteesAudits: "/Committees/api/Dashboard/CommitteeAudits",
    GetActiveStatuses: "/Committees/api/Dashboard/CommitteeActivityStatus",
    ExportExcel: "/Committees/api/Dashboard/ExportExcel/CommitteeAudits",

  };
  public static taskBoard = {
    checkBoard: "/BAU/api/TaskBoard/Check",
    createBoard: "/BAU/api/TaskBoard/Create",
    getBoard: "/BAU/api/TaskBoard/Get",
    getIsights: "/BAU/api/TaskBoard/GetInsights",
    getAllBoards: "/BAU/api/TaskBoard/GetAllTaskBoards",
    getGroupRoles: "/BAU/api/BusinessRole/GetGroupRoles",
    getAvailableBudgetMainTask: "/BAU/api/TaskBoard/AvailableBudget/",
    getAvailableBudgetTask: "/BAU/api/MainTask/AvailableBudget/",
  };

  public static Innovation = {
    dashboard: {
    },
    challenge: {
      add: "/Innovation/api/Challenge/Add",
      list: "/Innovation/api/Challenge/Search",
      analytics: "/Innovation/api/Challenge/Analytics",
      usersList: "/Innovation/api/Challenge/Analytics",
    }
  }

  public static transition = {
    add: "/WorkflowEngine/api/Transition/Add",
    delete: "/WorkflowEngine/api/Transition/Delete"
  }

  public static BAU = {
    MainTasks: {
      getDetails: "/BAU/api/MainTask/GetDetails",
    },
    Tasks: {
      getTasks: "/BAU/api/MainTask/GetTasks",
      getDetails: "/BAU/api/SubTask/Get",
      getFiles: "/BAU/api/SubTask/GetFiles",
      getHistory: "/BAU/api/SubTask/GetHistory",
      updateProgress: "/BAU/api/SubTask/UpdateProgress",
      addComment: "/BAU/api/SubTask/Comments/Add",
      updateStatus: "/BAU/api/SubTask/UpdateStatus",

    },
    Roles: {
      getRoles: "/BAU/api/BusinessRole/Search",
      create: "/BAU/api/BusinessRole/Create",
      update: "/BAU/api/BusinessRole/Update",
      delete: "/BAU/api/BusinessRole/Delete",
    },
    Dashboard: {
      getMainTasks: "/BAU/api/Dashboard/TotalMainTasks",
      getTotalSubTasks: "/BAU/api/Dashboard/TotalSubTasks",
      getOverAllProgress: "/BAU/api/Dashboard/OverallProgress",
      getSectorPerformance: "/BAU/api/Dashboard/SectorsPerformance",
      getBestContributers: "/BAU/api/Dashboard/BestContributors",
      getTasksPerMontth: "/BAU/api/Dashboard/TasksStatusPerMonth",
      getActualVSPlannedProgress: "/BAU/api/Dashboard/ActualVsPlannedProgress",
      getBudgetStatistics: "/BAU/api/Dashboard/BudgetStatistics",
      getTasksStatusPerQuarter: "/BAU/api/Dashboard/TasksStatusPerQuarter",
      getRolesCoverage: "/BAU/api/Dashboard/RolesCoverage",
      getTasksDetails: "/BAU/api/Dashboard/TasksDetails",
      getMainTasksByYear: "/BAU/api/MainTask/Get",
    },
    TasksManagement: {
      checkBoard: "/BAU/api/TaskBoard/Check",
      createBoard: "/BAU/api/TaskBoard/Create",
      getBoard: "/BAU/api/TaskBoard/Get",
      getIsights: "/BAU/api/TaskBoard/GetInsights",
      getAllBoards: "/BAU/api/TaskBoard/GetAllTaskBoards",
      getGroupRoles: "/BAU/api/BusinessRole/GetGroupRoles",
      getAvailableBudgetMainTask: "/BAU/api/TaskBoard/AvailableBudget/",
      getAvailableBudgetTask: "/BAU/api/MainTask/AvailableBudget/",
      createMainTask: "/BAU/api/MainTask/Create",
      editMainTask: "/BAU/api/MainTask/Update",
      createSubTask: "/BAU/api/SubTask/Create",
      editSubTask: "/BAU/api/SubTask/Update",
      getMainTasks: "/BAU/api/MainTask/get/",
      getSubTaskDetails: "/BAU/api/SubTask/Get",
      searchFollowUp: "/BAU/api/SubTask/FollowUp/GetToImport",
    },
  }
}
