import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import {
    ServiceDashboardProps, serviceComment, serviceStat, histogramData
} from "@/app/(site)/(apps)/client-satisfaction/dashboard/service/typesOLD";

export async function POST(req: NextRequest) {

    try {
        const body = await req.json();

        const response = await apiClient(
            '/dashboards/clientSatisfaction/getServices',
            {
                method: 'POST',
                body: JSON.stringify(body),
            })

        if (!response.ok) {
            throw new Error("Failed to fetch client satisfaction service data");
        }

        const allData: ServiceDashboardProps = await response.json();

        return NextResponse.json({
            ...allData,
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error.message || "An error occurred." },
            { status: 500 },
        );
    }
}
