import { WorkflowStage } from "@/components/Sidebars/WorkflowSidebar/WorkflowSidebar";
import { LayoutKeys } from "@/types/form";

export interface WorkflowLayoutProps {
  stages: WorkflowStage[];
  layout: LayoutKeys;
  workflowInstanceId: string | null;
}

export interface Form {
  id: number;
  name: string;
  description: string;
  jsonFile: string | Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

export interface FormDataResponse {
  id: number;
  businessProcessId: number;
  workflowInstanceId: number;
  customerId: number;
  currentStartByDefaultState: boolean;
  startDate?: string;
  completeDate?: string;
  stepName?: string;
  jsonResponse?: Record<string, any> | string;
  statusId?: number;
  saveAllowed?: boolean;
  uniqueId: string;
  startedBy?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  statusName: string;
}

export interface Variables {
  workflowInstanceId: number;
  businessProcessInstanceId: number;
  fieldName: string;
  fieldValue: string;
  dataType: string;
  createdAt: string;
}
