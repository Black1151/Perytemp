import {NextRequest, NextResponse} from "next/server";
import apiClient from "@/lib/apiClient";

interface apiBodyType {
    email?: string;
    loginType?: string;
    password?: string;
    sub?: string;
}

export async function POST(req: NextRequest) {
    const {email, loginType, password, sub} = await req.json();

    const {searchParams} = req.nextUrl;

    // Extract `searchParams` from the request URL
    const secureLink = req.nextUrl.searchParams.get("l");

    try {
        let apiBody: apiBodyType = {};

        apiBody = {
            email: email,
            loginType: loginType,
            password: password,
            sub: sub,
        }

        const response = await apiClient("/authentication/linkAppleLogin", {
            method: "POST",
            body: JSON.stringify(apiBody),
        });

        const data = await response.json();

        if (!response.ok || response.status !== 200) {
            const errorMessage = data?.error || "Invalid login credentials";
            return NextResponse.json(
                {error: errorMessage},
                {status: response.status},
            );
        }

        if (response.ok || response.status === 200) {

            let redirectUrl = (secureLink)
                ? `${process.env.NEXT_PUBLIC_BASE_URL}/login?appleAccountLinked=${email}&l=${secureLink}`
                : `${process.env.NEXT_PUBLIC_BASE_URL}/login?appleAccountLinked=${email}`;

            return NextResponse.json({redirectUrl});
        }
    } catch (error: any) {
        console.error(error);
        const errorMessage = error.message || "An error occurred during login";
        return NextResponse.json({error: errorMessage}, {status: 500});
    }
}