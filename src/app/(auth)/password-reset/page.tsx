import { Center, VStack } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LoginCard } from "@/components/login/LoginCard";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { redirect } from "next/navigation";
import { PasswordResetForm } from "@/components/forms/PasswordResetForm";

interface ActivateAccountPageProps {
  searchParams: { token?: string };
}

export default function ResetPasswordPage({
  searchParams,
}: ActivateAccountPageProps) {
  const token = searchParams.token!;

  if (!token) {
    redirect("/login");
  }

  return (
    <PerygonContainer>
      <Center flex={1}>
        <LoginCard
          titleComponent={
            <VStack position="absolute" top="90px">
              <LetterFlyIn fontSize={90}>Perygon</LetterFlyIn>
              <LetterFlyIn fontSize={40}>Please Enter</LetterFlyIn>
              <LetterFlyIn fontSize={40}>New Password!</LetterFlyIn>
            </VStack>
          }
        >
          <PasswordResetForm token={token} errors={{}} />
        </LoginCard>
      </Center>
    </PerygonContainer>
  );
}
