import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";


interface BigUpCategoryPayload {
    name: string;
    description: string;
    points: number;
    giverPoints: number
    isActive: boolean;
}

interface BigUpCategory {
    uniqueId: number;
    name: string;
    description: string;
    points: number;
    giverPoints: number
    isActive: boolean;
}

export async function GET(req: NextRequest) {
    try {
        console.log("[BigUp] GET: Fetching categories");
        const searchParams = req.nextUrl.searchParams;
        const customerId = searchParams.get('customerId') || null;
        console.log("[BigUp] GET: Customer ID:", customerId);

        const response = await apiClient(
            `/userBigupType/allBy?customerId=${customerId}&orderBy=isActive&sort=desc`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();
        console.log("[BigUp] GET: Successfully fetched categories");
        console.log(data)
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[BigUp] GET: Error fetching categories:", error.message);
        const errorMessage =
            error.message ||
            "An error occurred while fetching BigUp categories data.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        console.log("[BigUp] POST: Creating new category");
        const authToken = req.headers.get('authorization')?.split(' ')[1];

        const { name, description, points, giverPoints, isActive }: BigUpCategoryPayload = await req.json();
        console.log("[BigUp] POST: Category details:", { name, description, points, giverPoints, isActive });

        const response = await apiClient(`/userBigupType`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken ? `${authToken}` : "",
            },
            body: JSON.stringify({
                name,
                description,
                points,
                giverPoints,
                isActive
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("[BigUp] POST: API error:", errorData);
            throw new Error(errorData.error || "Failed to create category on external API");
        }

        const data = await response.json();
        console.log("[BigUp] POST: Successfully created category");
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[BigUp] POST: Error creating category:", error.message);
        const errorMessage =
            error.message || "An error occurred while creating BigUp category.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        console.log("[BigUp] PUT: Updating category");
        const authToken = req.headers.get('authorization')?.split(' ')[1];

        const body = await req.json();
        const { uniqueId, name, description, points, giverPoints, isActive }: BigUpCategory = body;
        console.log("[BigUp] PUT: Category details:", { uniqueId, name, description, points, giverPoints, isActive });

        if (!uniqueId) {
            console.error("[BigUp] PUT: Missing required parameter: id");
            return NextResponse.json(
                { error: "Missing required parameter: id" },
                { status: 400 }
            );
        }

        const response = await apiClient(`/userBigupType/${uniqueId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken ? `${authToken}` : "",
            },
            body: JSON.stringify({
                name,
                description,
                points,
                giverPoints,
                isActive
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("[BigUp] PUT: API error:", errorData);
            throw new Error(errorData.error || "Failed to update category on external API");
        }

        const data = await response.json();
        console.log("[BigUp] PUT: Successfully updated category");
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[BigUp] PUT: Error updating category:", error.message);
        const errorMessage =
            error.message || "An error occurred while updating BigUp category.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

