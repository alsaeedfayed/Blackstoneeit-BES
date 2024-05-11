export class Permissions {
  public static ServiceDesk = {
    serviceCatalog: {
      view: 3001,
      favourite: 3002,
      startService: 3003,
      rate: 3004,
    },
    manageService: {
      view: 3005,
      publish: 3006,
      create: 3007,
    },
    serviceDashboard: {
      view: 3024,
    },
    myRequests: {
      view: 3008,
      details: 3009,
      attension: 3010,
    },
    manageForms: {
      view: 3011,
      activate: 3012,
      create: 3013,
    },
    agentQueue: {
      view: 3014,
      details: 3015,
    },
    EService: {
      view: 3019,
      create: 3023,
      edit: 3020,
      delete: 3022,
      move: 3021
    }
  };

  public static Performance = {
    Scorecard: {
      All: 6004,
      GetById: 6005,
      MyActions: 6006,
      Status: 6007,
      Create: 6008,
      Submit: 6009,
      Update: 6010,
      viewStatusDetails: 6036,
    },
    Goal: {
      Add: 6001,
      Edit: 6002,
      Delete: 6003,
    },
    Dashboard: {
      View: 6021,
    },
    Scorecard_Submission: {
      View: 6022,
    },
    Scorecard_Settings: {
      View: 6023,
    },
    Scorecard_Reports: {
      View: 6024,
    },
  };

  public static UserManagement = {
    Users: {
      view: 1000,
    },
    Roles: {
      view: 1001,
    },
    Groups: {
      view: 1002,
    },
    Committees: {
      view: 1048,
    },
  };

  public static WorkFlow = {
    ManageDelegations: 5000,
    ManageProcess: 5001,
  };

  public static PMO = {
    AssignedToMe: 4000,
  };
  public static Committees = {

    PerformanceDashboard: {
      view: 9006
    },

    Requests: {
      create: 9000,
      view: 9001
    },

    CommitteesList: {
      view: 9016
    },

    ModifyRequest: {
      view: 9003
    },

    Evaluations: {
      create: 9007,
      view: 9008,
      cancel: 9010,
      close: 9009,
      edit : 9023,

      Observation: {
        create: 9012,
        reopen: 9015,
        close: 9014
      }
    },

    Settings: {
      Voting: {
        create: 9019,
        view: 9018,
        update: 9020,
        delete: 9021,
      },

      WeightSettings : {
        view : 9022
      }
    }


  };

  public static BAU = {
    OperationPlan: {
      view: 7001,
    },
    Roles: {
      view: 7007,
      create: 7008,
      edit: 7009,
      delete: 7010,
    }
  };
}
