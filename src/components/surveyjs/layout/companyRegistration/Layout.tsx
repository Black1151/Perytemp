// CompanyRegistrationLayout.jsx – vertical, full‑width, tidy 💅
// --------------------------------------------------------------
// Simplified layout: everything is now stacked top‑to‑bottom in
// a single column and the component just fills whatever space
// its parent grants (w="full"). We dropped the unused imports
// and extraneous wrappers.
// --------------------------------------------------------------

import React from "react";
import { Survey } from "survey-react-ui";
import {
  Flex,
  Box,
  Button,
  Stack,
  useTheme,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import { ClientSatisfactionLayoutProps } from "@/types/form";
import SurveyNavigationGuard from "@/components/surveyjs/SurveyNavigationGuard";
import { useUser } from "@/providers/UserProvider";
import { useWorkflow } from "@/providers/WorkflowProvider";
import TopNavigation from "@/components/surveyjs/layout/client-satisfaction/TopNavigation";
import PerygonCard from "@/components/layout/PerygonCard";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DoneIcon from "@mui/icons-material/Done";
import PublishIcon from "@mui/icons-material/Publish";

const MotionButton = motion(Button);

const CompanyRegistrationLayout: React.FC<ClientSatisfactionLayoutProps> = ({
  surveyJSModel,
  formNavigation,
  saveAllowed,
  allowAlwaysEdit,
}) => {
  const { user } = useUser();
  const { currentStage } = useWorkflow();
  const theme = useTheme();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!user) return null;

  const canSave = () => {
    if (user.role === "CA") return false;
    if (allowAlwaysEdit) return true;
    if (saveAllowed && currentStage?.stageStatus !== "Complete") return true;
    if (saveAllowed && user.role === "PA") return true;
    return false;
  };

  return (
    <SurveyNavigationGuard
      isEditing={formNavigation.isEditMode}
      setToDisplayMode={formNavigation.switchToDisplayMode}
      setToEditMode={formNavigation.switchToEditMode}
    >
      {/* Full‑width container; nothing fancy */}
      <Box w="90vw" justifyItems={"top"}>
        {/* Vertical stack of all children */}
        <Stack spacing={4} w="full">
          {/* Optional helper blurb */}
          {currentStage?.headerText && (
            <PerygonCard bg={theme.colors.elementBG} borderRadius="md">
              <Text
                color={theme.colors.primaryTextColor}
                fontFamily="Metropolis"
              >
                {currentStage.headerText}
              </Text>
            </PerygonCard>
          )}

          {/* Breadcrumb / page number display */}
          <Flex
            as="nav"
            position="sticky"
            top="0"
            zIndex="docked" // or a number like 1000
            width="100%"
            pb={2}
          >
            <TopNavigation {...formNavigation} />
          </Flex>

          {/* SurveyJS block – grows to use remaining height if parent allows */}
          <Box h="min" w="full" borderRadius="md" overflow="hidden">
            <Survey model={surveyJSModel}/>
          </Box>

          {/* Bottom navigation row */}
          <Flex w="full" justify="space-between" wrap="wrap" gap={2} position="sticky" bottom={0} p={2} bg="white" borderRadius={"md"} boxShadow="md">
            {/* Prev / Next */}
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
                  bgColor="darkGray"
                  w={["2rem", "full"]}
                  h={["2rem", "3rem"]}
                  border="1px solid darkGray"
                  color="white"
                  _hover={{ color: "darkGray", backgroundColor: "white" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={formNavigation.nextPage}
                >
                  <ArrowForwardIcon />
                  {isMobile ? "" : "Next"}
                </MotionButton>
              )}
            </Flex>

            {/* Save / Submit */}
            <Flex gap={2}>
              {formNavigation.isEditMode && canSave() && (
                <MotionButton
                  borderRadius="full"
                  size={isMobile ? "sm" : "md"}
                  bgColor="green"
                  border="1px solid lightGray"
                  w={["2rem", "full"]}
                  h={["2rem", "3rem"]}
                  color="white"
                  _hover={{ color: "green", backgroundColor: "white" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={formNavigation.saveSurvey}
                >
                  <PublishIcon />
                  {isMobile ? "" : "Save"}
                </MotionButton>
              )}

              {formNavigation.isEditMode && (
                <MotionButton
                  borderRadius="full"
                  size={isMobile ? "sm" : "md"}
                  bgColor="green"
                  border="1px solid lightGray"
                  w={["2rem", "full"]}
                  h={["2rem", "3rem"]}
                  color="white"
                  _hover={{ color: "green", backgroundColor: "white" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={formNavigation.submitSurvey}
                >
                  <DoneIcon />
                  {isMobile ? "" : "Submit"}
                </MotionButton>
              )}
            </Flex>
          </Flex>
        </Stack>
      </Box>
    </SurveyNavigationGuard>
  );
};

export default CompanyRegistrationLayout;
