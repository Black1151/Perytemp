import { Tool, UserIdentity } from "@/types/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function MainPage<T extends Tool>({
  searchParams,
  toolId,
  workflowId,
  ClientInnerComponent,
  children,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  toolId: string;
  workflowId: string;
  ClientInnerComponent?: React.ComponentType<{
    toolData: T;
    toolId: string;
    workflowId: string;
  }>;
  children?: ReactNode;
}) {
  const cookieStore = cookies();
  const uniqueId = cookieStore.get("user_uuid")?.value;
  const authToken = cookieStore.get("auth_token")?.value;

  let userIdentity: UserIdentity | null = null;
  let toolData: T | null = null;

  if (uniqueId && authToken) {
    try {
      const [identityResponse, toolDataResponse] = await Promise.all([
        fetch(
          `${process.env.BE_URL}/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}&selectColumns=userImageUrl,firstName,role`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        ),
        fetch(
          `${process.env.BE_URL}/getView?view=vwToolsWorkflowList&toolId=${toolId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        ),
      ]);

      const identityData = await identityResponse.json();
      const toolDataData = await toolDataResponse.json();

      userIdentity = identityData.resource as UserIdentity;
      toolData = toolDataData.resource as T;
    } catch (error) {
      console.error(error);
      redirect("/login");
    }
  }

  if (ClientInnerComponent && toolData) {
    return (
      <ClientInnerComponent
        toolData={toolData}
        toolId={toolId}
        workflowId={workflowId}
      />
    );
  }

  return <>{children}</>;
}
