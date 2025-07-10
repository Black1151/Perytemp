import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

export async function PUT(req: NextRequest) {
    try {
        const authToken = req.headers.get('authorization')?.split(' ')[1]

        const body = await req.json();
        const { uniqueId, data } = body;
        const { isActive } = data

        if (!uniqueId) {
            return NextResponse.json(
                { error: "Missing required parameter: id" },
                { status: 400 }
            );
        }

        console.log("UID: ", uniqueId)
        console.log("isActive:", isActive)

        console.log("PUT /api/bigup/categories: Making apiClient call to /userBigupType");
        const response = await apiClient(`/userBigupType/${uniqueId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken ? `${authToken}` : "",
            },
            body: JSON.stringify({
                isActive
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("PUT /api/bigup/categories: apiClient error response:", errorData);
            throw new Error(errorData.error || "Failed to update category on external API");
        }

        const res = await response.json();
        console.log("PUT /api/bigup/categories: apiClient successful data:", res);

        return NextResponse.json(res);
    } catch (error: any) {
        console.error("PUT /api/bigup/categories: Error in catch block:", error);
        const errorMessage =
            error.message || "An error occurred while updating BigUp category.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}