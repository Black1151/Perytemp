import React from "react";
import { Box, Flex, Text, Tooltip, useTheme } from "@chakra-ui/react";
import { Lock } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

interface SideBarMenuItemProps {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
  iconSize?: string | number;
  showIconOnly?: boolean;
  hoverStyles?: React.CSSProperties;
  isLeft?: boolean;
  active?: boolean;
  locked?: boolean;
  badgeNumber?: number | null;
}

const MotionBox = motion(Box);

const SideBarMenuItem: React.FC<SideBarMenuItemProps> = ({
  label,
  icon,
  onClick,
  iconSize = "18px",
  showIconOnly = false,
  hoverStyles,
  isLeft = false,
  active = false,
  locked = false,
  badgeNumber = null,
}) => {
  const theme = useTheme();

  return (
    <Flex
      pos="relative"
      overflow="visible"
      fontSize={16}
      flexDirection={isLeft ? "column" : "row"}
      alignItems="center"
      width="100%"
      py={2}
      color={
        locked
          ? theme.colors.gray[400]
          : active
          ? "white"
          : theme.colors.primary
      }
      bg={
        locked
          ? theme.colors.gray[100]
          : active
          ? `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary})`
          : "transparent"
      }
      borderRadius="md"
      border={
        active
          ? "1px solid white"
          : locked
          ? "1px solid " + theme.colors.gray[300]
          : "1px solid transparent"
      }
      _hover={
        locked
          ? undefined
          : {
              ...hoverStyles,
              cursor: "pointer",
              border: `1px solid ${theme.colors.primary}`,
              color: active
                ? "white"
                : hoverStyles?.color || theme.colors.primary,
            }
      }
      onClick={() => {
        if (!locked) onClick();
      }}
      pointerEvents={locked ? "none" : "auto"}
      cursor={locked ? "not-allowed" : "pointer"}
    >
      {showIconOnly ? (
        <Tooltip label={label} hasArrow placement="right">
          <Box
            boxSize={iconSize}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {icon}
          </Box>
        </Tooltip>
      ) : (
        <Box
          boxSize={iconSize}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Box>
      )}

      {!showIconOnly && (
        <Text flex={1} zIndex={2} textAlign="center">
          {label}
        </Text>
      )}

      {locked && !showIconOnly && (
        <Box
          pos="absolute"
          top={2}
          right={2}
          zIndex={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Lock
            style={{
              fontSize: theme.sizes[4],
              color: theme.colors.gray[500],
            }}
          />
        </Box>
      )}

      {/* iOS‐style badge with animation */}
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
    </Flex>
  );
};

export default SideBarMenuItem;
