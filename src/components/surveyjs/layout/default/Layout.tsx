"use client";

import React, { useEffect, useState } from "react";
import { Survey } from "survey-react-ui";
import TopNavigation from "@/components/surveyjs/layout/default/TopNavigation";
import { Box, Flex } from "@chakra-ui/react";
import BottomNavigation from "@/components/surveyjs/layout/default/BottomNavigation";
import { DefaultLayoutProps } from "@/types/form";
import SurveyNavigationGuard from "@/components/surveyjs/SurveyNavigationGuard";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  surveyJSModel,
  formNavigation,
  showTopNavigation = true,
  showBottomNavigation = true,
}) => {
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const handlePageChange = () => {
      if (surveyJSModel.currentPageNo > formNavigation.pageNo) {
        setDirection(1);
      } else {
        setDirection(-1);
      }
    };

    surveyJSModel.onCurrentPageChanged.add(handlePageChange);

    return () => {
      surveyJSModel.onCurrentPageChanged.remove(handlePageChange);
    };
  }, [surveyJSModel, formNavigation.pageNo]);

  return (
    <SurveyNavigationGuard
      isEditing={formNavigation.isEditMode}
      setToDisplayMode={formNavigation.switchToDisplayMode}
      setToEditMode={formNavigation.switchToEditMode}
    >
      <Flex
        w="full"
        maxW={"100%"}
        px={[0, 0, 0]}
        justify="center"
        align="center"
        py={4}
        position="relative"
        direction="column"
        bgColor="transparent"
      >
        {showTopNavigation && <TopNavigation {...formNavigation} />}
        <Box w="100%" overflow="hidden" bg={"elementBG"}>
          <MotionBox
            key={formNavigation.pageNo}
            initial={{
              x: direction === 1 ? 1000 : -1000,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: direction === 1 ? -1000 : 1000,
              opacity: 0,
            }}
            transition={{ duration: 0.5 }}
            bgColor="elementBG"
          >
            <Box bgColor="elementBG">
              <Survey model={surveyJSModel} />
            </Box>
          </MotionBox>
          {showBottomNavigation && <BottomNavigation {...formNavigation} />}
        </Box>
      </Flex>
    </SurveyNavigationGuard>
  );
};

export default DefaultLayout;
