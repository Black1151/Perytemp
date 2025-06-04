import {NextResponse} from "next/server";
import apiClient from "@/lib/apiClient";

interface EnpsMainDashboardResponse {
    resource: EnpsMainDashboard;
}

interface EnpsMainDashboard {

}


export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await apiClient(
            "/dashboards/enps/getMainDashboard",
            {
                method: "POST",
                body: JSON.stringify(body),
            },
        );

        if (!response.ok) {
            throw new Error("Failed to fetch enps data");
        }

        const responseData: EnpsMainDashboardResponse =
            await response.json();

        return NextResponse.json({
            resource: responseData.resource,
        });
    } catch (error) {
        console.error(
            "Error fetching enps data:",
            error,
        );
        return NextResponse.json(
            {error: "Failed to fetch data from the API."},
            {status: 500},
        );
    }
}
