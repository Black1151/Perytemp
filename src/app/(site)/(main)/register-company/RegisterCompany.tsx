"use client";

import React, { useState, useEffect } from "react";
import { Flex, VStack, Text, Button, useTheme } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { useUser } from "@/providers/UserProvider";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";
import LogoUpload from "./LogoUpload";
import ConfettiAlt from "@/components/animations/confetti/ConfettiAlt";
import { Check } from "@mui/icons-material";

interface RegisterCompanyProps {
  registerCustomerJson: any;
  initialCustomerData: any;
}

export default function RegisterCompany({
  registerCustomerJson,
  initialCustomerData,
}: RegisterCompanyProps) {
  const { user } = useUser();

  const [customerData, setCustomerData] = useState<any>(initialCustomerData);
  const [hasLogo, setHasLogo] = useState<boolean>(
    Boolean(initialCustomerData?.custImageUrl)
  );
  const theme = useTheme();

  useEffect(() => {
    setHasLogo(Boolean(customerData?.custImageUrl));
  }, [customerData]);

  if (!user) return null;

  return (
    <PerygonContainer>
      <Flex direction="column" flex={1} maxW={1200}>
        <Flex
          direction={["column", "row", "row"]}
          flex={1}
          gap={[3, 4, 8]}
          align={["center", "flex-end"]}
          pb={[2, 4]}
          justify={["center", "start"]}
          flexWrap="wrap"
          px={8}
        >
          <VStack
            pt={["10px", "30px", "50px"]}
            spacing={[1, 3, 4]}
            align={["center", "start"]}
            textAlign={["center", "left"]}
          >
            <Text fontSize={[28, 28, 32]} fontFamily="bonfire" color="white">
              Welcome to...
            </Text>
            <Text
              fontSize={[62, 70, 90]}
              lineHeight={1}
              fontFamily="bonfire"
              color="white"
            >
              Perygon
            </Text>
          </VStack>
          <Text
            fontSize={[28, 28, 32]}
            lineHeight={[1, 2]}
            fontFamily="bonfire"
            color="white"
            textAlign={["center", "left"]}
            mt={[1, 0]}
          >
            Set up your organisation
          </Text>
        </Flex>

        <Flex flex="1" w="100%" justify="center" align="flex-start" pb={8}>
          <AdminFormWrapper
            formJson={registerCustomerJson}
            data={{
              userEmail: user.email,
              userUniqueId: user.userUniqueId,
              userId: user.userId,
            }}
            layoutConfig={{
              layoutKey: "company-registration",
              layoutProps: {},
            }}
            globalVariables={[]}
            stylingConfig={{ sjsFilePath: "admin", cssFilePath: "" }}
            jsImport=""
            excludeKeys={["imageUrl"]}
            endpoint="/companyRegistration"
            formSuccessMessage="Your company has been registered successfully!"
            reloadPageOnSuccess={false}
            redirectUrl={"/register-company/success"}
            isNew
            isAllowedToEdit
          />
        </Flex>
      </Flex>
    </PerygonContainer>
  );
}
