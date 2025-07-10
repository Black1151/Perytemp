import React, { useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import { FormNavigationProps } from "@/types/form";
import useModal from "@/components/surveyjs/useModal";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ScrollablePageList from "@/components/surveyjs/layout/default/ScrollablePageList";
import CustomToggle from "@/components/surveyjs/layout/default/CustomToggle";
import { Info as InfoIcon } from "@mui/icons-material";

const animationDuration = 0.05; // Define the duration of the animation in seconds

const TopNavigation: React.FC<FormNavigationProps> = ({
  pageNo,
  jumpToPage,
  resetSurvey,
  switchToEditMode,
  pageListOptions,
  isEditMode,
}) => {
  const { isOpen, openModal, closeModal } = useModal(); // Use the hook
  const previousPageNo = React.useRef(pageNo);
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false);

  const handleCancelEdit = () => {
    resetSurvey();
    closeModal();
  };

  const handleToggle = () => {
    if (isEditMode) {
      openModal();
    } else {
      switchToEditMode();
    }
  };

  useEffect(() => {
    previousPageNo.current = pageNo;
  }, [pageNo]);

  return (
    <Box w="100%">
      {/* Custom Toggle Tab Container */}
      <Box
        borderRadius="lg"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        position="relative"
        zIndex={1}
      >
        <Box
          bg="elementBG"
          py={2}
          px={4}
          borderBottomLeftRadius={"none"}
          borderBottomRightRadius={"none"}
          borderTopLeftRadius={"lg"}
          borderTopRightRadius={"lg"}
        >
          {/* Custom Toggle in its own box above the ScrollablePageList */}
          <CustomToggle
            iconA={VisibilityIcon}
            iconB={EditIcon}
            isChecked={isEditMode}
            canEdit={true}
            onToggle={handleToggle}
          />
        </Box>
      </Box>
      <Box
        bg="elementBG"
        py={4}
        px={2}
        borderBottomLeftRadius={"none"}
        borderBottomRightRadius={"none"}
        borderTopLeftRadius={"lg"}
        borderTopRightRadius={"none"}
        w="100%"
      >
        <Flex gap={2} flexWrap={"wrap"} align={"center"} justify={"flex-end"}>
          <Box w={"100%"}>
            <ScrollablePageList
              pageListOptions={pageListOptions}
              pageNo={pageNo}
              jumpToPage={jumpToPage}
              animationDuration={animationDuration}
              previousPageNo={previousPageNo}
            />
          </Box>
        </Flex>
        <SurveyModal
          isOpen={isOpen}
          onClose={closeModal}
          onConfirm={handleCancelEdit}
          title="Confirm Edit Cancellation"
          bodyContent="Are you sure you want to cancel editing? Any unsaved changes will be lost."
          confirmLabel="Abandon changes"
          cancelLabel="Keep editing"
          type="info"
        />
        <SurveyModal
          isOpen={isHelpModalOpen}
          onClose={() => setIsHelpModalOpen(false)}
          onConfirm={() => setIsHelpModalOpen(false)}
          title="Navigation Help"
          bodyContent="Learn how to navigate through the survey."
          confirmLabel="Close"
          type="info"
          icon={<InfoIcon fontSize="inherit"/>}
        />
      </Box>
    </Box>
  );
};

export default TopNavigation;
