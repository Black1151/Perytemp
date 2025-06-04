"use client";

import React from "react";
import {
  Box,
  HStack,
  Heading,
  useTheme,
  useBreakpointValue,
} from "@chakra-ui/react";
import BackButton from "@/components/BackButton";
import AddButtonMobile from "@/components/Buttons/AddButtonMobile";
import AddButtonDesktop from "@/components/Buttons/AddButtonDesktop";
import { Celebration } from "@mui/icons-material";

interface RecognitionHeaderProps {
  headingText: string;
  onAddButtonClick?: () => void;
}

const RecognitionHeader: React.FC<RecognitionHeaderProps> = ({
  headingText,
  onAddButtonClick = () => {},
}) => {
  const theme = useTheme();
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

  return (
    <HStack alignItems="center" justifyContent="space-between" w="full" my={2}>
      <HStack>
        <BackButton />
        <Heading
          as="h1"
          fontWeight={100}
          color={theme.components.recognitionHeader.baseStyle.textcolor}
          fontSize={{ base: "2xl", md: "4xl" }}
          fontFamily="Bonfire"
          textAlign="center"
          mt={2}
        >
          {headingText}
        </Heading>
      </HStack>

      <Box>
        {isMobile ? (
          <AddButtonMobile
            onAddButtonClick={onAddButtonClick}
            IconComponent={Celebration}
            workflow={false}
            label="Recognise Someone!"
          />
        ) : (
          <AddButtonDesktop
            label="Recognise Someone!"
            onAddButtonClick={onAddButtonClick}
            IconComponent={Celebration}
          />
        )}
      </Box>
    </HStack>
  );
};

export default RecognitionHeader;
