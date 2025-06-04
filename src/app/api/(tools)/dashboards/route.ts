import {NextRequest, NextResponse} from "next/server";
import apiClient from "@/lib/apiClient";
import {getUser} from "@/lib/dal";

export async function GET(req: NextRequest) {
    try {
        // Extract query parameters from URL
        const {searchParams} = new URL(req.url);
        const toolId = searchParams.get("toolId");
        const workflowId = searchParams.get("workflowId");
        const pathname = searchParams.get("pathname") || "";

        if (!toolId || !workflowId) {
            return NextResponse.json(
                {error: "Missing required parameters: toolId and workflowId"},
                {status: 400}
            );
        }

        const user = await getUser();
        const userRole = user.role;
        const userCustomerId = user.customerId;
        const isManagerofDept = user.teamManagerCount === 1 || user.teamManagerCount === 3;
        const isManagerofTeam = user.teamManagerCount === 2 || user.teamManagerCount === 3;

        // Fetch dashboards and tool data in parallel
        const [dashboardListRes, toolDataRes] = await Promise.all([
            apiClient(`/getAllView?view=vwWorkflowDashboardList&workflowId=${workflowId}`, {
                method: "GET",
                cache: "no-store",
            }),
            apiClient(`/getView?view=vwToolsWorkflowList&toolId=${toolId}`, {
                method: "GET",
                cache: "no-store",
            }),
        ]);

        if (!dashboardListRes.ok || !toolDataRes.ok) {
            return NextResponse.json({error: "Failed to fetch data"}, {status: 500});
        }

        const dashboardListData = await dashboardListRes.json();
        const toolConfigData = await toolDataRes.json();
        const dashboardList = dashboardListData.resource;

        // Filter dashboards based on user role & restrictions
        const filteredDashboards = dashboardList.filter((dashboard: any) => {
            let customerRestrictionList = null;

            if (dashboard.customerRestrictionList) {
                try {
                    customerRestrictionList = JSON.parse(dashboard.customerRestrictionList);
                    if (!Array.isArray(customerRestrictionList)) {
                        customerRestrictionList = null;
                    }
                } catch (error) {
                    customerRestrictionList = null;
                }
            }

            if (customerRestrictionList && !customerRestrictionList.includes(userCustomerId)) {
                return false;
            }

            if (dashboard.deptManagerRequired && !isManagerofDept) {
                return false;
            }

            if (dashboard.teamManagerRequired && !isManagerofTeam) {
                return false;
            }

            switch (userRole) {
                case "CU":
                    return (
                        dashboard.userRole === "CU" ||
                        (dashboard.teamManagerRequired && dashboard.userRole === "CU") ||
                        (dashboard.deptManagerRequired && dashboard.userRole === "CU")
                    );

                case "CL":
                case "CA":
                    return true;

                case "CS":
                    return (
                        dashboard.userRole === "CU" ||
                        dashboard.userRole === "CS" ||
                        (dashboard.teamManagerRequired &&
                            (dashboard.userRole === "CU" || dashboard.userRole === "CS")) ||
                        (dashboard.deptManagerRequired &&
                            (dashboard.userRole === "CU" || dashboard.userRole === "CS"))
                    );

                default:
                    return false;
            }
        });

        let redirectPath: string | undefined;
        if (filteredDashboards.length > 0) {
            redirectPath = filteredDashboards[0].dashboardUrl;
        }

        return NextResponse.json({
            filteredDashboards,
            toolData: toolConfigData.resource,
            redirectPath,
        });
    } catch (error) {
        console.error("Error in /api/dashboards:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}
