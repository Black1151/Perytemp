"use client";

import React from "react";
import { Survey } from "survey-react-ui";
import { Button, Flex, Heading, Image } from "@chakra-ui/react";
import { HappinessLayoutProps } from "@/types/form";
import SurveyNavigationGuard from "@/components/surveyjs/SurveyNavigationGuard";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { useTheme } from "@chakra-ui/react";
const HappinessLayout: React.FC<HappinessLayoutProps> = ({
  surveyJSModel,
  formNavigation,
  showTitle = false,
}) => {
  const theme = useTheme();

  return (
    <>
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
        >
          {/*TODO: this could be tool logo instead of hard coded*/}
          <Image
            src="/carousel/logos/happiness-score-logo-new.webp"
            maxW="200px"
            maxH="200px"
            mb={4}
            alt="Happiness Score Icon"
          />
          <Heading
            as="h1"
            fontFamily="Metropolis"
            fontWeight={300}
            fontSize={[18, 18, 36]}
            color={theme.fringeCases.happinessScoreForm.textColor}
            textAlign={"center"}
          >
            How happy are{" "}
            <LetterFlyIn
              whiteSpace={"wrap"}
              fontSize={36}
              duration={0.5}
              fontWeight={400}
              color={theme.fringeCases.happinessScoreForm.textColor}
            >
              YOU
            </LetterFlyIn>{" "}
            this week?
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
    </>
  );
};
export default HappinessLayout;
