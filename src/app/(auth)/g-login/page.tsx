import React from 'react';
import {PerygonContainer} from "@/components/layout/PerygonContainer";
import GuestLoginClient from "@/app/(auth)/g-login/GuestLoginClient";
import {redirect} from "next/navigation";

interface SearchParams {
    l?: string;
}

const Page = async ({searchParams}: { searchParams: SearchParams }) => {

    const secureLink = searchParams.l;

    if (!secureLink) {
        return redirect('/login');
    }

    return (
        <PerygonContainer>
            <GuestLoginClient secureLink={secureLink}/>
        </PerygonContainer>
    );
};

export default Page;