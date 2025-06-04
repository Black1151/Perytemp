'use client';

import React, {useEffect} from 'react';
import {signOut} from "next-auth/react";
import {useRouter} from "next/navigation";

const ExternalUserMainClient = () => {

    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/sign-out", {
            method: "POST",
        });
        await signOut({redirect: false});
        router.push("/login");
    };

    useEffect(() => {
        handleLogout();
    })

    return (
        <>
        </>
    );
};

export default ExternalUserMainClient;