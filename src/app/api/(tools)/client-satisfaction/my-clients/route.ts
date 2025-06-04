import {NextRequest, NextResponse} from "next/server";
import apiClient from "@/lib/apiClient";
import { 
    MyClientsDashboardProps
} from "@/app/(site)/(apps)/client-satisfaction/dashboard/my-clients/types";

export async function POST(req: NextRequest) {

    try {
        const body = await req.json();

        const response = await apiClient(
            '/dashboards/clientSatisfaction/getMyClients',
            {
                method: 'POST',
                body: JSON.stringify(body),
            })

        if (!response.ok) {
            throw new Error("Failed to fetch client satisfaction my-clients data");
        }

        const allData: MyClientsDashboardProps = await response.json();

        return NextResponse.json({
            ...allData,
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            {error: error.message || "An error occurred."},
            {status: 500},
        );
    }
}
