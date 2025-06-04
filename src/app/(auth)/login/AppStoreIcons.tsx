// AppStoreIcons.tsx

"use client";

import { Flex, Link, Image, IconButton } from "@chakra-ui/react";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function getOSAndBrowser() {
  const userAgent =
    typeof window !== "undefined" ? window.navigator.userAgent : "";
  let os: string = "Unknown OS";
  let browser: string = "Unknown Browser";

  if (/windows phone/i.test(userAgent)) {
    os = "Windows Phone";
  } else if (/windows/i.test(userAgent)) {
    os = "Windows";
  } else if (/android/i.test(userAgent)) {
    os = "Android";
  } else if (/iPad|iPhone|iPod/.test(userAgent)) {
    os = "iOS";
  } else if (/mac/i.test(userAgent)) {
    os = "MacOS";
  } else if (/linux/i.test(userAgent)) {
    os = "Linux";
  }

  if (
    /chrome|crios/i.test(userAgent) &&
    !/edge|edg|opr|opera/i.test(userAgent)
  ) {
    browser = "Chrome";
  } else if (/firefox|fxios/i.test(userAgent)) {
    browser = "Firefox";
  } else if (
    /safari/i.test(userAgent) &&
    !/chrome|crios|opr|opera|edg|edge/i.test(userAgent)
  ) {
    browser = "Safari";
  } else if (/edg|edge/i.test(userAgent)) {
    browser = "Edge";
  } else if (/opr|opera/i.test(userAgent)) {
    browser = "Opera";
  }

  return { os, browser };
}

const MotionFlex = motion(Flex);

const AppStoreIcons = () => {
  const [showGoogle, setShowGoogle] = useState(false);
  const [showApple, setShowApple] = useState(false);
  const [visible, setVisible] = useState(false);
  const [wide, setWide] = useState(false);

  const isRunningInApp = (() => {
    if (typeof window === "undefined") return false;
    const ua = window.navigator.userAgent;
    const appUA = /median|gonative/i.test(ua);
    const hasBridge = typeof (window as any).Median !== "undefined";
    return appUA || hasBridge;
  })();

  useEffect(() => {
    const { os } = getOSAndBrowser();
    const isWide = window.innerWidth >= 768;
    setWide(isWide);

    if (isWide || os === "Windows" || os === "MacOS") {
      setShowGoogle(true);
      setShowApple(true);
    } else {
      if (os === "Android") setShowGoogle(true);
      if (os === "iOS") setShowApple(true);
    }

    setVisible(true);
  }, []);

  if (isRunningInApp) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (showGoogle || showApple) && (
        <MotionFlex
          as="footer"
          initial={{ opacity: 0, y: wide ? -30 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: wide ? -30 : 30 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.75 }}
          justify="center"
          align="center"
          gap={4}
          bg="rgba(255,255,255,0.80)"
          borderBottomRadius={["none", "md"]}
          borderTopRadius={["md", "none"]}
          px={[0, 6]}
          py={3}
          zIndex={400}
          position={["fixed", "relative"]}
          bottom="0"
          w={["full", "auto"]}
        >
          {/* Close icon only on mobile */}
          {!wide && (
            <IconButton
              aria-label="Close"
              icon={<CloseIcon />}
              variant="ghost"
              size="xs"
              position="absolute"
              top="8px"
              right="8px"
              onClick={() => setVisible(false)}
            />
          )}

          {showGoogle && (
            <Link
              href="https://play.google.com/store/apps/details?id=uk.co.sedulo.perygon&pcampaignid=web_share"
              isExternal
            >
              <Image
                src="/images/Google_Play_Store_badge.svg.webp"
                alt="Get Perygon on Google Play"
                height={["40px", "45px", "50px"]}
                objectFit="contain"
              />
            </Link>
          )}
          {showApple && (
            <Link
              href="https://apps.apple.com/gb/app/perygon/id6740286271"
              isExternal
            >
              <Image
                src="/images/Apple_App_Store_badge.svg"
                alt="Download Perygon on the App Store"
                height={["40px", "45px", "50px"]}
                objectFit="contain"
              />
            </Link>
          )}
        </MotionFlex>
      )}
    </AnimatePresence>
  );
};

export default AppStoreIcons;
