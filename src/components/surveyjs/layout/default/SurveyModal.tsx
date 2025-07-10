import React from "react";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import { useTheme } from "@chakra-ui/react";
import { Check, Close } from "@mui/icons-material";

type ModalType = 'success' | 'warning' | 'error' | 'info' | 'default';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type?: ModalType;
  showButtons?: {
    close: boolean;
    confirm: boolean;
  };
  title?: string | React.ReactNode;
  titleProps?: any;
  bodyContent?: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: React.ReactNode;
  isConfirmLoading?: boolean;
  isCancelLoading?: boolean;
}

const getModalConfig = (type: ModalType, theme: any) => {
  const configs = {
    success: {
      icon: <DoneIcon fontSize="inherit"/>,
      bg: "green.500",
      color: 'white',
    },
    warning: {
      icon: <WarningIcon fontSize="inherit"/>,
      bg: "orange.500",
      color: 'white',
    },
    error: {
      icon: <ErrorIcon fontSize="inherit"/>,
      bg: theme.colors.red[500],
      color: 'white',
    },
    info: {
      icon: <InfoIcon fontSize="inherit"/>,
      bg: theme.colors.primary,
      color: 'white',
    },
    default: {
      icon: null,
      bg: theme.colors.elementBG,
      color: theme.colors.primaryTextColor,
    },
  };

  return configs[type];
};

const SurveyModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type = 'default',
  showButtons = {
    close: true,
    confirm: true,
  },
  title = "Confirm Action",
  bodyContent = "Are you sure you want to perform this action?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  icon,
  isConfirmLoading = false,
  isCancelLoading = false,
}) => {
  const theme = useTheme();
  const modalConfig = getModalConfig(type, theme);

  return (
    <SpringModal
      isOpen={isOpen}
      onClose={onClose}
      showClose={false}
      frontIcon={icon || modalConfig.icon}
      bgIcon={icon || modalConfig.icon}
      header={title}
      body={bodyContent}
      bg={modalConfig.bg}
      color={modalConfig.color}
      primaryLabel={showButtons.confirm ? confirmLabel : undefined}
      onPrimaryClick={showButtons.confirm ? onConfirm : undefined}
      primaryIcon={<Check/>}
      isPrimaryLoading={isConfirmLoading}
      secondaryLabel={showButtons.close ? cancelLabel : undefined}
      onSecondaryClick={showButtons.close ? onClose : undefined}
      secondaryIcon={<Close/>}
      isSecondaryLoading={isCancelLoading}
    />
  );
};

export default SurveyModal; 