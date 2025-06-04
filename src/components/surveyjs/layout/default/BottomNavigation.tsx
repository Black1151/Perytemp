import React from "react";
import { Box, Button, Flex, Stack, useBreakpointValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Done as DoneIcon,
} from "@mui/icons-material";
import { FormNavigationProps } from "@/types/form";

const MotionButton = motion(Button);

const BottomNavigation: React.FC<FormNavigationProps> = ({
  nextPage,
  prevPage,
  submitSurvey,
  pageListOptions,
  isFirstPage,
  isLastPage,
  isEditMode,
}) => {
  // Responsive value for the button text; hides text on mobile
  const buttonText = useBreakpointValue({ base: "", md: "Previous" });
  const nextButtonText = useBreakpointValue({ base: "", md: "Next" });
  const submitButtonText = useBreakpointValue({ base: "", md: "Submit" });
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box px={["24px", "24px", "40px"]} py={"1em"} borderRadius="lg" w="100%">
      <Flex
        justify={pageListOptions.length <= 1 ? "flex-end" : "space-between"}
        align="center"
        w="100%"
      >
        {/* Left section: Previous and Next buttons */}
        {pageListOptions.length > 1 && (
          <Stack direction="row" spacing={4}>
            <MotionButton
              size={isMobile ? "sm" : "md"}
              onClick={prevPage}
              disabled={isFirstPage}
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
            >
              <ArrowBackIcon />
              {buttonText}
            </MotionButton>

            <MotionButton
              size={isMobile ? "sm" : "md"}
              onClick={nextPage}
              disabled={isLastPage}
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
              {nextButtonText}
            </MotionButton>
          </Stack>
        )}

        {/* Right section: Submit button */}
        <Stack direction="row" spacing={4}>
          {isEditMode && (
            <MotionButton
              size={isMobile ? "sm" : "md"}
              onClick={submitSurvey}
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
              {submitButtonText}
            </MotionButton>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default BottomNavigation;
