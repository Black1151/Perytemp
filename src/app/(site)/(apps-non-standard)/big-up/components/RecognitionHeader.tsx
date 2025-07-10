"use client";

import React, { useState } from "react";
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
import { Celebration, Category, Help } from "@mui/icons-material";
import ContextualMenu from "@/components/Sidebars/ContextualMenu";
import { useUser } from "@/providers/UserProvider";
import { MenuItem } from "@/components/Sidebars/NavigationSidebar/NavigationMobilePopoutMenu";
import CategoriesModal from "./CategoriesModal";
import GuideModal from "@/components/modals/guideModal/guideModal";

interface RecognitionHeaderProps {
  headingText: string;
  onAddButtonClick?: () => void;
  customerId?: string;
}

const RecognitionHeader: React.FC<RecognitionHeaderProps> = ({
  headingText,
  onAddButtonClick = () => {},
}) => {
  const theme = useTheme();
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });
  const { user } = useUser();
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const menuItems = React.useMemo(() => {
    const items: MenuItem[] = [];
    
    if (user && ["PA", "CA"].includes(user.role)) {
      items.push({
        label: "Edit Categories",
        icon: <Category />,
        onClick: () => setIsCategoriesModalOpen(true)
      });
    }

    items.push({
      label: "View Guide",
      icon: <Help />,
      onClick: () => setIsGuideModalOpen(true)
    });

    return items;
  }, [user]);

  return (
    <>
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

        <HStack>
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
          <ContextualMenu menuItems={menuItems} bottomOffset={["10px", "45px"]}/>
        </HStack>
      </HStack>

      <CategoriesModal 
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        customerId={user?.customerId ?? null}
        toolId={1}
        isFree={false}
      />

      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        guideType="tool"
        toolId={100}
      />
    </>
  );
};

export default RecognitionHeader;
