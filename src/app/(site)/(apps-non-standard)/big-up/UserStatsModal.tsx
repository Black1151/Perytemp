import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { BigUpStatsCard } from "./masonry/BigUpStatsCard";
import { BigUpStats } from "./types";

export interface UserStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: BigUpStats;
  handleProfilePicClick: (uuid: string) => void;
}

export const UserStatsModal: React.FC<UserStatsModalProps> = ({
  isOpen,
  onClose,
  userStats,
  handleProfilePicClick,
}) => {
  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent mx={4} borderRadius="lg">
        <BigUpStatsCard
          name={userStats.userName}
          location={userStats.userLocation}
          received={userStats.bigUpReceivedPoints}
          given={userStats.bigUpGivenPoints}
          score={userStats.bigUpTotal}
          userImage={userStats.userImage}
          ranking={userStats.bigUpRanking}
          handleProfilePicClick={handleProfilePicClick}
          UUID={userStats.userUniqueId}
        />
      </ModalContent>
    </Modal>
  );
};
