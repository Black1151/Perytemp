"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useFetchClient } from "@/hooks/useFetchClient";
import { usePathname } from "next/navigation";
import { WorkflowStage } from "@/components/Sidebars/WorkflowSidebar/WorkflowSidebar";

interface ToolConfigResponse {
  resource: {
    id: number;
    logoImageUrl: string;
    appUrl: string;
  };
}

interface WorkflowContextType {
  toolId: string | null;
  setToolId: (id: string | null) => void;
  toolLogo: string | null;
  toolPath: string | null;
  workflowId: string | null;
  setWorkflowId: (id: string | null) => void;
  currentWorkflowInstanceId: string | null;
  setCurrentWorkflowInstanceId: (id: string | null) => void;
  currentBusinessProcessInstanceId: string | null;
  setCurrentBusinessProcessInstanceId: (id: string | null) => void;
  currentStage: WorkflowStage | null;
  setCurrentStage: (stage: WorkflowStage | null) => void;
  headerBackgroundImageUrl: string | null;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export const useWorkflow = (): WorkflowContextType => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
};

const pathsToResetToolLogo = [
  "/happiness-score",
  "/enps",
  "/cnps",
  "/client-satisfaction",
  "/business-score",
  "/risk-management",
  "/big-up",
  "/tester",
];

export const WorkflowProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toolId, setToolId] = useState<string | null>(null);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [currentWorkflowInstanceId, setCurrentWorkflowInstanceId] = useState<
    string | null
  >(null);
  const [
    currentBusinessProcessInstanceId,
    setCurrentBusinessProcessInstanceId,
  ] = useState<string | null>(null);
  const [toolLogo, setToolLogo] = useState<string | null>(null);
  const [toolPath, setToolPath] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<WorkflowStage | null>(null);

  const { fetchClient } = useFetchClient();
  const pathname = usePathname();

  // Reset tool logo and path when navigating to specific paths
  useEffect(() => {
    const shouldReset = pathsToResetToolLogo.some((path) =>
      pathname.startsWith(path)
    );
    if (!shouldReset) {
      setToolId(null);
      setWorkflowId(null);
      setToolLogo(null);
      setToolPath(null);
      setCurrentStage(null);
    }
  }, [pathname]);

  // Load initial state from localStorage on mount
  useEffect(() => {
    const initializeStateFromLocalStorage = () => {
      const savedToolId = localStorage.getItem("toolId");
      const savedWorkflowId = localStorage.getItem("workflowId");
      const savedWorkflowInstanceId = localStorage.getItem(
        "currentWorkflowInstanceId"
      );
      const savedBusinessProcessInstanceId = localStorage.getItem(
        "currentBusinessProcessInstanceId"
      );

      if (savedToolId) setToolId(savedToolId);
      if (savedWorkflowId) setWorkflowId(savedWorkflowId);
      if (savedWorkflowInstanceId)
        setCurrentWorkflowInstanceId(savedWorkflowInstanceId);
      if (savedBusinessProcessInstanceId)
        setCurrentBusinessProcessInstanceId(savedBusinessProcessInstanceId);
    };

    initializeStateFromLocalStorage();
  }, []);

  // Fetch tool configuration when toolId or workflowId changes
  useEffect(() => {
    const fetchToolConfig = async () => {
      if (!toolId || !workflowId) return;

      try {
        const res: ToolConfigResponse | null = await fetchClient(
          `/api/toolConfig/findBy?id=${toolId}`
        );
        if (res?.resource) {
          setToolPath(
            `${res.resource.appUrl}?toolId=${toolId}&wfId=${workflowId}`
          );
          setToolLogo(res.resource.logoImageUrl || null);
        } else {
          setToolLogo(null);
          console.error("Invalid response structure or missing logoImageUrl");
        }
      } catch (error) {
        console.error("Error fetching tool config:", error);
      }
    };

    fetchToolConfig();
  }, [toolId, workflowId]);

  // Save to localStorage when state changes
  useEffect(() => {
    if (toolId) localStorage.setItem("toolId", toolId);
    if (!toolId) localStorage.setItem("toolId", "");
  }, [toolId]);

  useEffect(() => {
    if (workflowId) localStorage.setItem("workflowId", workflowId);
    if (!workflowId) localStorage.setItem("workflowId", "");
  }, [workflowId]);

  useEffect(() => {
    if (currentWorkflowInstanceId) {
      localStorage.setItem(
        "currentWorkflowInstanceId",
        currentWorkflowInstanceId
      );
    }
    if (!currentWorkflowInstanceId) {
      localStorage.setItem("currentWorkflowInstanceId", "");
    }
  }, [currentWorkflowInstanceId]);

  useEffect(() => {
    if (currentBusinessProcessInstanceId) {
      localStorage.setItem(
        "currentBusinessProcessInstanceId",
        currentBusinessProcessInstanceId
      );
    } else {
      localStorage.setItem("currentBusinessProcessInstanceId", "");
    }
  }, [currentBusinessProcessInstanceId]);

  return (
    <WorkflowContext.Provider
      value={{
        toolId,
        setToolId,
        toolLogo,
        toolPath,
        workflowId,
        setWorkflowId,
        currentWorkflowInstanceId,
        setCurrentWorkflowInstanceId,
        currentBusinessProcessInstanceId,
        setCurrentBusinessProcessInstanceId,
        currentStage,
        setCurrentStage,
        headerBackgroundImageUrl:
          currentStage?.headerBackgroundImageUrl || null,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export default WorkflowContext;
