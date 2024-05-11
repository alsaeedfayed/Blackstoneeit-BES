import { AgentQueueStatusMode } from '../../components/agent-queue-table/enums';

export interface IAgentQueueItem {
  requestNumber: string;
  title: string;
  status: AgentQueueStatusMode;
  assignedTo: string;
  employeeName: string;
  creationDate: string;
  serviceName: string;
  sla: string;
  id: string;
  currentStatus: any;
  requester: {
    email: string;
    fileName: string;
    fullName: string;
    id: string;
    position: string;
  };
  serviceId: number;
  categoryId: number;
}
