import React from "react";
import { Survey } from "survey-react-ui";
import { Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { eNPSLayoutProps } from "@/types/form";
import SurveyNavigationGuard from "@/components/surveyjs/SurveyNavigationGuard";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { useUser } from "@/providers/UserProvider";

const ENPSLayout: React.FC<eNPSLayoutProps> = ({
  surveyJSModel,
  formNavigation,
}) => {
  const { user } = useUser();

  return (
    <SurveyNavigationGuard
      isEditing={formNavigation.isEditMode}
      setToDisplayMode={formNavigation.switchToDisplayMode}
      setToEditMode={formNavigation.switchToEditMode}
    >
      <Flex
        direction="column"
        justify={"center"}
        align={"center"}
        height={"full"}
        gap={2}
      >
        <Image
          src="/carousel/logos/enps-logo-new.webp"
          maxW="150px"
          maxH="150px"
          alt="eNPS Icon"
        />
        <Text
          color={"white"}
          fontFamily={"Metropolis"}
          fontSize={["xs", "sm"]}
          fontWeight={100}
          textAlign={"center"}
          mb={6}
        >
          Please take a moment to provide your score – all submissions will be
          anonymous
        </Text>
        <Heading
          as="h1"
          fontFamily="Metropolis"
          fontWeight={300}
          fontSize={[18, 18, 26]}
          color={"white"}
          textAlign={"center"}
        >
          How likely is it that you would{" "}
          <LetterFlyIn
            whiteSpace={"wrap"}
            fontSize={26}
            duration={0.5}
            fontWeight={400}
          >
            RECOMMEND
          </LetterFlyIn>{" "}
          {user?.customerName ? user.customerName : "our company"} as a place to
          work?
        </Heading>
        <Survey model={surveyJSModel} />
        {/* Submit Button */}
        {formNavigation.isEditMode && (
          <Button
            px={8}
            py={4}
            fontSize="lg"
            fontWeight="bold"
            bgColor="green"
            border="1px solid lightGray"
            color="white"
            _hover={{
              bg: "white",
              color: "green",
              transform: "scale(1.05)",
              border: "1px solid lightGray",
              boxShadow: "lg",
            }}
            borderRadius="full"
            onClick={formNavigation.submitSurvey}
          >
            Submit
          </Button>
        )}
      </Flex>
    </SurveyNavigationGuard>
  );
};

export default ENPSLayout;
