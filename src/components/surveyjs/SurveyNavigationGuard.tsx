import React from "react";
import { useRouter } from "next/navigation";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import { Warning as WarningIcon } from "@mui/icons-material";

interface SurveyNavigationGuardProps {
  isEditing: boolean;
  setToDisplayMode: () => void;
  setToEditMode: () => void;
  children: React.ReactNode; // Render the rest of the application
}

const SurveyNavigationGuard: React.FC<SurveyNavigationGuardProps> = ({
  isEditing,
  setToDisplayMode,
  setToEditMode,
  children,
}) => {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [pendingNavigation, setPendingNavigation] = React.useState<
    string | null
  >(null);
  const router = useRouter();

  const handleRouteChange = (url: string) => {
    if (isEditing) {
      setPendingNavigation(url);
      setModalIsOpen(true);
      setToDisplayMode();
      return false;
    }
    return true;
  };

  React.useEffect(() => {
    const originalPush = router.push;
    const originalReplace = router.replace;

    if (isEditing) {
      router.push = async (url, ...args) => {
        const canNavigate = handleRouteChange(url);
        if (!canNavigate) return; // Wait for user confirmation
        return originalPush(url, ...args);
      };

      router.replace = async (url, ...args) => {
        const canNavigate = handleRouteChange(url);
        if (!canNavigate) return; // Wait for user confirmation
        return originalReplace(url, ...args);
      };
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isEditing) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    if (isEditing) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEditing]);

  const confirmNavigation = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
    setModalIsOpen(false);
    setPendingNavigation(null);
  };

  const cancelNavigation = () => {
    setModalIsOpen(false);
    setPendingNavigation(null);
    setToEditMode();
  };

  return (
    <>
      {children}
      <SurveyModal
        isOpen={modalIsOpen}
        onClose={cancelNavigation}
        onConfirm={confirmNavigation}
        title="Unsaved Changes"
        bodyContent="You may have unsaved changes. Are you sure you want to leave this page?"
        confirmLabel="Leave"
        cancelLabel="Stay"
        type="warning"
        icon={<WarningIcon fontSize="inherit"/>}
        showButtons={{
          close: true,
          confirm: true
        }}
      />
    </>
  );
};

export default SurveyNavigationGuard;
