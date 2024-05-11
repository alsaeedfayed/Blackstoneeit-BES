export class RoutesVariables {

  public static Root = 'committees-management';

  public static Dashboard = {
    Root: 'dashboard'
  }
  public static Requests = {
    Root: 'requests',
    Create: 'new',
    Edit: 'edit/:id',
    Details: 'details/:id',
  };

  public static ModifyRequests = {
    Root : 'modify-requests',
    Details : 'details/:id'
  }

  public static Evaluation = {
    Root: 'evaluation',
    Create: 'new',
    Edit: 'edit/:id',
    Details: 'details/:id',
  };
  public static Committees = {
    Root: 'committees',
    Details: {
      CommitteeId: ':id',
      Meetings: {
        Root: 'meetings',
        Create: 'new',
        Edit: 'edit/:id',
        Details: 'details/:id',
      },
      Tasks: {
        Root: 'tasks',
        Create: 'new',
        Edit: 'edit/:id',
        Details: 'details/:id',
      },
      Decisions: {
        Root: 'decisions',
        Create: 'new',
        Edit: 'edit/:id',
        Details: 'details/:id',
      },
      Group: {
        Root: 'groups',
        Create: 'new',
        Edit: 'edit/:id',
        Details: 'details/:id',
      },
      KPI: {
        Root: 'KPIs',
      },
      About: 'about'
    }

  }
  public static KPI = {
    Details: 'committee-details/:committeeId/Kpi/:kpiId'
  }
  public static Meeting = {
    MeetingId: 'meetingId',
    CommitteeId: 'committeeId',
    Create: 'committee/:committeeId/meeting/new',
    Update: `committee/:committeeId/meeting/edit/:meetingId`,
    Details: 'committee/:committeeId/meeting/:meetingId',
    MomUpdate: 'committee/:committeeId/meeting/mom-update/:meetingId',
  };

  public static VotingTemplate = {
    List: 'settings/voting-templates'
  }

  public static Decision = {
    DecisionId: 'decisionId',
    CommitteeId: 'committeeId',
    Details: 'committee/:committeeId/decisions/:decisionId',
    Create: 'committee/:committeeId/new-decision',
    List: 'committee-details/:committeeId/decisions',
    Update: `committee/:committeeId/decision/edit/:decisionId`,
  }
}
