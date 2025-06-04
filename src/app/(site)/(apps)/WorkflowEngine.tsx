"use client";

import React, { useEffect } from "react";
import { useWorkflow } from "@/providers/WorkflowProvider";

interface WorkflowEngineProps {
  toolId: string | null;
  workflowId: string | null;
  children: React.ReactNode;
}

const WorkflowEngine: React.FC<WorkflowEngineProps> = ({
  toolId,
  workflowId,
  children,
}) => {
  const { setToolId, setWorkflowId } = useWorkflow();

  useEffect(() => {
    if (toolId) {
      setToolId(toolId);
    }

    if (workflowId) {
      setWorkflowId(workflowId);
    }
  }, [toolId, workflowId]);

  return <>{children}</>;
};

export default WorkflowEngine;
