// PasswordRecoveryPage.tsx (Server Component)

import {Center, VStack} from "@chakra-ui/react";
import {PerygonContainer} from "@/components/layout/PerygonContainer";
import {LoginCard} from "@/components/login/LoginCard";
import {LetterFlyIn} from "@/components/animations/text/LetterFlyIn";
import {PasswordRecoveryPageClient} from "./PasswordRecoveryPageClient";

export default function PasswordRecoveryPage() {
    return (
        <PerygonContainer>
            <Center flex={1} maxW={["100%"]}>
                <LoginCard
                    titleComponent={
                        <VStack position="absolute" top="60px">
                            <LetterFlyIn fontSize={90}>Perygon</LetterFlyIn>
                            <LetterFlyIn fontSize={50}>Password</LetterFlyIn>
                            <LetterFlyIn fontSize={50}>Recovery</LetterFlyIn>
                        </VStack>
                    }
                >
                    <PasswordRecoveryPageClient/>
                </LoginCard>
            </Center>
        </PerygonContainer>
    );
}
