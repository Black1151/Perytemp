import React, {ReactNode} from 'react';
import {PerygonContainer} from "@/components/layout/PerygonContainer";
import {Flex} from "@chakra-ui/react";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";

interface PublicLayoutProps {
    children: ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({children}) => {

    return (
        <PerygonContainer>
            <Flex
                minHeight="100svh"
                maxHeight="100svh" // or remove if you don't need to cap the outer container
                flexDirection="column"
                gap={6}
                justify="center"
                align="center"
                py={2}
                w="full"
                maxW={1500}
            >
                <PublicHeader/>

                <Flex
                    flexDirection="column"
                    w={["95%", "90%", "85%"]}
                    bg="white"
                    borderRadius="2xl"
                    p={[2, 2, 4]}
                    shadow="xl"
                    gap={2}
                    overflowY="auto"
                    maxHeight={700}
                >
                    {children}
                </Flex>

                <PublicFooter/>
            </Flex>
        </PerygonContainer>
    );
};

export default PublicLayout;
