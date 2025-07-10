import { useState, ReactNode } from "react";
import GuideModal from "@/components/modals/guideModal/guideModal";
import MyBookingsModal from "@/app/(site)/(apps-non-standard)/hospitality-hub/app/components/myBookingsModal/MyBookingsModal";

/**
 * ──────────────────────────────────────────────────────────────
 * useContextualMenuActions Hook
 *
 * This hook enables menu items to trigger custom actions or modals by name.
 *
 * Usage in ContextualMenu:
 *   const { functionMap, modals } = useContextualMenuActions(toolId);
 *   // Use functionMap in your menu mapping
 *   // Render {modals} at the bottom of your JSX
 *
 * To add or maintain dynamic menu actions:
 *
 * 1. Define your action function inside this hook (e.g., const openMyModal = () => {...})
 *    - If your action opens a modal, add a useState for its open/close state and render the modal in the modals block below.
 *
 * 2. Add your function to the functionMap (e.g., openMyModal,)
 *    - The key must match the function name you want to call from menuItemOnClick.
 *
 * 3. In your menu item data (in the DB), set menuItemOnClick: '#openMyModal#'
 *    - The string inside the #...# must match the function name in functionMap.
 *    - This will call your function when the menu item is clicked.
 *
 * 4. (Optional) To pass props or context, use closures or component state as needed.
 *
 * 5. If the function does not exist in functionMap, a warning will be logged (in development).
 *
 * 6. To add a new modal:
 *    - Import the modal component at the top of this file.
 *    - Add a useState for its open/close state.
 *    - Add a function to open it, and add that function to functionMap.
 *    - Render the modal in the modals block below, passing the open/close state and any needed props.
 *
 * Example: openGuidesModal opens the GuideModal below.
 * ──────────────────────────────────────────────────────────────
 */
export function useContextualMenuActions(toolId?: number) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isMyHospitalityBookingsModalOpen, setIsMyHospitalityBookingsModalOpen] = useState(false);

  const openGuidesModal = () => setIsGuideModalOpen(true);
  const openMyHospitalityBookingsModal = () => setIsMyHospitalityBookingsModalOpen(true)

  const functionMap: Record<string, () => void> = {
    openGuidesModal,
    openMyHospitalityBookingsModal
  };

  const modals: ReactNode = (
    <>
    <GuideModal
      isOpen={isGuideModalOpen}
      onClose={() => setIsGuideModalOpen(false)}
      guideType="tool"
      toolId={toolId}
    />
    <MyBookingsModal
      isOpen={isMyHospitalityBookingsModalOpen}
      onClose={() => setIsMyHospitalityBookingsModalOpen(false)}
    />
    </>
  );

  return { functionMap, modals };
} 