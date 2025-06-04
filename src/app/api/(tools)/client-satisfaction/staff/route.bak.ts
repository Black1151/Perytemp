// import { NextRequest, NextResponse } from "next/server";
// import apiClient from "@/lib/apiClient";
// import {
//     StaffDashboardProps
// } from "@/app/(site)/(apps)/client-satisfaction/dashboard/staff/types";

// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();

//         console.log(body);

//         const response = await apiClient(
//             '/dashboards/clientSatisfaction/getStaff',
//             {
//                 method: 'POST',
//                 body: JSON.stringify(body),
//             })

//         console.log(response);

//         if (!response.ok) {
//             throw new Error("Failed to fetch client satisfaction staff data");
//         }

//         const allData: StaffDashboardProps = await response.json();

//         return NextResponse.json({
//             ...allData,
//         });
//     } catch (error: any) {
//         console.error(error);
//         return NextResponse.json(
//             { error: error.message || "An error occurred." },
//             { status: 500 },
//         );
//     }
// }
