"use client";

import React, { useEffect, useState, useRef } from "react";
import { Box, useTheme, useBreakpointValue, Container } from "@chakra-ui/react";
import { ShoppingCart } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { useBasket } from "./useBasket";
import MiniConfetti from "./MiniConfetti";

export function ManageSubscriptionFab() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { basket } = useBasket();
  const controls = useAnimation();
  const [showConfetti, setShowConfetti] = useState(false);
  const [fabPosition, setFabPosition] = useState({ x: 0, y: 0 });
  const fabRef = useRef<HTMLDivElement>(null);
  const prevBasketLength = useRef<number>(0);
  const isFirstRender = useRef(true);

  const fabVariants = {
    initial: {
      scale: 1,
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
      },
    },
    bounce: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.5,
        times: [0, 0.2, 0.5, 1],
      },
    },
  };

  useEffect(() => {
    const basketContentLength = basket?.content?.length ?? 0;

    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevBasketLength.current = basketContentLength;
      return;
    }

    // Only show confetti when items are added (not removed)
    if (basketContentLength > prevBasketLength.current) {
      controls.start("bounce");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    prevBasketLength.current = basketContentLength;
  }, [basket?.content?.length, controls]);

  return (
    <Container
      /* 💡 always fixed so it stays visible while you scroll */
      position="fixed"
      /* vertical offset */
      bottom={isMobile ? 24 : 12}
      /* centred horizontally for desktop, bottom-right for mobile */
      left={isMobile ? "auto" : "85%"}
      right={isMobile ? 4 : "auto"}
      /* pull it back half its own width so it’s perfectly centred */
      transform={isMobile ? undefined : "translateX(-50%)"}
      /* let its own width decide how big it is */
      w="fit-content"
      zIndex={130}
      /* remove extra padding / max-width – they aren’t useful for a FAB */
      p={0}
      m={0}
    >
      <motion.div
        ref={fabRef}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        animate={controls}
        style={{ cursor: "pointer" }}
        onClick={() => router.push("/tool-store/manage-subscription")}
      >
        <Box
          w={isMobile ? "48px" : "64px"}
          h={isMobile ? "48px" : "64px"}
          borderRadius="full"
          bg={theme.colors.elementBG}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 4px 12px rgba(0,0,0,0.15)"
          backdropFilter="blur(2px)"
          _hover={{ boxShadow: "0 6px 16px rgba(0,0,0,0.2)" }}
        >
          <ShoppingCart
            sx={{
              color: theme.colors.primaryTextColor,
              fontSize: isMobile ? "24px" : "32px",
            }}
          />
        </Box>
      </motion.div>
    </Container>
  );
}