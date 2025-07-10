"use client";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { useRouter } from "next/navigation";
import ErrorBox from "@/components/layout/ErrorBox";

export default function NotFoundPage() {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      router.push("/login");
    } catch (error) {
      router.push("/error");
    }
  };

  const supportingText = `It looks like your session may have expired or the page you are
            looking for doesn't exist anymore. Login to get yourself back
            on track.`;

  return (
    <PerygonContainer>
      <ErrorBox
        buttonText={"Login"}
        supportingText={supportingText}
        onButtonClick={logout}
      />
    </PerygonContainer>
  );
}
