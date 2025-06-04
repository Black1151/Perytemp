import React from "react";
import { Box, Divider, Text, useTheme, VStack } from "@chakra-ui/react";
import { Lock } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

interface BottomNavigationMenuItemProps {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
  iconSize?: string | number;
  hoverStyles?: React.CSSProperties;
  active?: boolean;
  locked?: boolean;
  badgeNumber?: number;
}

const BottomNavigationMenuItem: React.FC<BottomNavigationMenuItemProps> = ({
  label,
  icon,
  onClick,
  iconSize = "24px",
  hoverStyles,
  active = false,
  locked = false,
  badgeNumber,
}) => {
  const theme = useTheme();
  const MotionBox = motion(Box);

  return (
    <VStack
      position="relative"
      spacing={1}
      align="center"
      justify="center"
      minWidth={81}
      py={2}
      px={1}
      h="full"
      bg={
        locked
          ? theme.colors.gray[100]
          : active
            ? `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary})`
            : "transparent"
      }
      color={
        locked
          ? theme.colors.gray[400]
          : active
            ? "white"
            : theme.colors.primary
      }
      borderRadius="md"
      border={locked ? `1px solid ${theme.colors.gray[300]}` : "none"}
      pointerEvents={locked ? "none" : "auto"}
      cursor={locked ? "not-allowed" : "pointer"}
      _hover={
        locked
          ? undefined
          : {
              ...hoverStyles,
              backgroundColor: active
                ? `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary})`
                : hoverStyles?.background || theme.colors.gray[100],
              color: active
                ? "white"
                : hoverStyles?.color || theme.colors.primary,
            }
      }
      onClick={() => {
        if (!locked) onClick();
      }}
      textAlign="center"
    >
      <Box
        boxSize={iconSize}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </Box>
      <Divider
        maxWidth={70}
        borderColor={
          locked
            ? theme.colors.gray[400]
            : active
              ? "white"
              : theme.colors.primary
        }
      />
      <Text fontSize={10}>{label}</Text>

      {locked && (
        <Box
          position="absolute"
          top={1}
          right={2}
          zIndex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Lock fontSize="small" style={{ color: theme.colors.gray[500] }} />
        </Box>
      )}

      <AnimatePresence>
      {badgeNumber != null && badgeNumber > 0 && (
        <MotionBox
          key={badgeNumber}
          pos="absolute"
          top={0}
          right={0}
          zIndex={4}
          pointerEvents="none"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Box
            bg={active ? "white" : theme.colors.secondary}
            color={active ? "black" : "white"}
            borderRadius="full"
            minW="18px"
            h="18px"
            fontSize="10px"
            fontWeight="bold"
            display="flex"
            alignItems="center"
            justifyContent="center"
            px="3px"
          >
            {badgeNumber > 9 ? "9+" : badgeNumber}
          </Box>
        </MotionBox>
      )}
      </AnimatePresence>
    </VStack>
  );
};

export default BottomNavigationMenuItem;
