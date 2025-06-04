import React from "react";
import { Survey } from "survey-react-ui";
import {
  Flex,
  Box,
  Button,
  useTheme,
  useBreakpointValue,
  Image,
  Text,
} from "@chakra-ui/react";
import {
  BusinessScoreLayoutProps,
  ClientSatisfactionLayoutProps,
} from "@/types/form";
import SurveyNavigationGuard from "@/components/surveyjs/SurveyNavigationGuard";
import { useUser } from "@/providers/UserProvider";
import { useWorkflow } from "@/providers/WorkflowProvider";
import TopNavigation from "@/components/surveyjs/layout/client-satisfaction/TopNavigation";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DoneIcon from "@mui/icons-material/Done";
import PublishIcon from "@mui/icons-material/Publish";
import PerygonCard from "@/components/layout/PerygonCard";
import BackButton from "@/components/BackButton";

const MotionButton = motion(Button);

const BusinessScoreLayout: React.FC<BusinessScoreLayoutProps> = ({
  surveyJSModel,
  formNavigation,
  saveAllowed,
  allowAlwaysEdit,
}) => {
  const { user } = useUser();
  const { currentStage, toolPath } = useWorkflow();
  const theme = useTheme();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!user) {
    return;
  }

  const canSave = () => {
    if (user.role === "EU") {
      return false;
    }

    // Assets and Risks after the fact
    if (allowAlwaysEdit && allowAlwaysEdit === true) {
      return true;
    }

    // Save allowed half way through to come back to stage
    if (
      saveAllowed &&
      saveAllowed === true &&
      currentStage?.stageStatus !== "Complete"
    ) {
      return true;
    }

    // CA can update a completed stage
    if (saveAllowed && saveAllowed === true && user?.role === "CA") {
      return true;
    }

    // Default to false unless condition
    return false;
  };

  return (
    <SurveyNavigationGuard
      isEditing={formNavigation.isEditMode}
      setToDisplayMode={formNavigation.switchToDisplayMode}
      setToEditMode={formNavigation.switchToEditMode}
    >
      <Flex
        direction="row"
        justify={"flex-start"}
        align={"flex-start"}
        flexWrap={"wrap"}
        w={"full"}
        gap={2}
        mt={2}
        maxHeight={["100%", null, "80vh"]}
      >
        <Box flex={1} height={["10svh", "10svh", "100svh"]}>
          <Flex
            position={"sticky"}
            top={20}
            flexDirection={"column"}
            justify={"center"}
            align={"center"}
            px={"20px"}
            gap={4}
          >
            <Flex
              flexDirection={["row-reverse", "row-reverse", "column"]}
              justify={"center"}
              align={"center"}
              px={"20px"}
              gap={2}
              w={"full"}
              position={"relative"}
            >
              <Flex
                position={"absolute"}
                left={0}
                top={0}
                justify={"center"}
                align={"center"}
              >
                <BackButton prevRoute={toolPath ?? undefined} />
              </Flex>
              <LetterFlyIn fontSize={isMobile ? 30 : 32}>
                {currentStage?.bpName}
              </LetterFlyIn>
              {currentStage?.headerLogo && (
                <Image
                  maxW={["20%", "20%", "80%"]}
                  display={"block"}
                  src={currentStage?.headerLogo}
                />
              )}
            </Flex>
            {currentStage?.headerText && (
              <PerygonCard
                borderRadius={"md"}
                bg={theme.colors.elementBG}
                display={["none", "none", "block"]}
              >
                <Text
                  color={theme.colors.primaryTextColor}
                  fontFamily={"Metropolis"}
                >
                  {currentStage?.headerText}
                </Text>
              </PerygonCard>
            )}
          </Flex>
        </Box>
        <Box
          flex={2}
          bg={theme.colors.elementBG}
          borderRadius="md"
          px={[2, 4]}
          py={[2, 3]}
          boxShadow="md"
          minWidth={["full", "45%"]}
          height="100%"
        >
          <TopNavigation {...formNavigation} />
          <Flex flex={1} height={["100%", null, "65vh"]} width="100%">
            <Survey model={surveyJSModel} />
          </Flex>

          <Flex justify={"space-between"}>
            <Flex gap={2}>
              {!formNavigation.isFirstPage && (
                <MotionButton
                  borderRadius="full"
                  size={isMobile ? "sm" : "md"}
                  bgColor="darkGray"
                  w={["2rem", "full"]}
                  h={["2rem", "3rem"]}
                  border="1px solid darkGray"
                  color="white"
                  _hover={{ color: "darkGray", backgroundColor: "white" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  display="flex"
                  alignItems="center"
                  gap={[0, 0, 2]}
                  lineHeight={0}
                  onClick={formNavigation.prevPage}
                >
                  <ArrowBackIcon />
                  {isMobile ? "" : "Previous"}
                </MotionButton>
              )}
              {!formNavigation.isLastPage && (
                <MotionButton
                  borderRadius="full"
                  size={isMobile ? "sm" : "md"}
                  onClick={formNavigation.nextPage}
                  bgColor="darkGray"
                  w={["2rem", "full"]}
                  h={["2rem", "3rem"]}
                  border="1px solid darkGray"
                  color="white"
                  _hover={{ color: "darkGray", backgroundColor: "white" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowForwardIcon />
                  {isMobile ? "" : "Next"}
                </MotionButton>
              )}
            </Flex>
            <Flex gap={2}>
              {formNavigation.isEditMode && canSave() && (
                <MotionButton
                  borderRadius="full"
                  size={isMobile ? "sm" : "md"}
                  onClick={formNavigation.saveSurvey}
                  bgColor="green"
                  border="1px solid lightGray"
                  w={["2rem", "full"]}
                  h={["2rem", "3rem"]}
                  color="white"
                  _hover={{ color: "green", backgroundColor: "white" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PublishIcon />
                  {isMobile ? "" : "Save"}
                </MotionButton>
              )}
              {formNavigation.isEditMode && (
                <MotionButton
                  borderRadius="full"
                  size={isMobile ? "sm" : "md"}
                  onClick={formNavigation.submitSurvey}
                  bgColor="green"
                  border="1px solid lightGray"
                  w={["2rem", "full"]}
                  h={["2rem", "3rem"]}
                  color="white"
                  _hover={{ color: "green", backgroundColor: "white" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <DoneIcon />
                  {isMobile ? "" : "Submit"}
                </MotionButton>
              )}
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </SurveyNavigationGuard>
  );
};

export default BusinessScoreLayout;
