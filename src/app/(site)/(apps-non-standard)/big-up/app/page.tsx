"use client";

import { useState, useEffect } from "react";
import { Flex, Grid, useTheme, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { SpringScale } from "@/components/animations/SpringScale";
import { useUnread } from "@/components/contexts/UnreadRecognitionContext";
import { hideScrollbar } from "@/utils/style/style-utils";
import PerygonCard from "@/components/layout/PerygonCard";
import { ConfettiWrapper } from "../components/ConfettiWrapper";
import RecognitionHeader from "../components/RecognitionHeader";
import useBigUpDashboard from "../hooks/useBigUpDashboard";
import useBigUpUserStats from "../hooks/useBigUpUserStats";
import { useRecognitionActions } from "../hooks/useRecognitionActions";
import { createTabsData } from "../lib/bigUpTabsData";
import { BigUpMasonry } from "../masonry/BigUpMasonry";
import { NewRecognitionModal } from "../modal/NewRecognitionModal";
import { RecognitionSuccessModal } from "../modal/RecognitionSuccessModal";
import SubmitScoreModal from "../modal/SubmitScoreModal";
import { RecognitionList } from "../tabs/OtherTabs/RecognitionCardList";
import { PerygonTabs } from "../tabs/PerygonTabs";
import { UserStatsModal } from "../UserStatsModal";

export default function BigUpPage() {
  const router = useRouter();
  const theme = useTheme();

  const { dashboardData, fetchDashboardData, loading } = useBigUpDashboard();
  const { userStats, fetchUserStats } = useBigUpUserStats();

  const {
    showSuccessModal,
    setShowSuccessModal,
    showConfetti,
    setShowConfetti,
    handleSubmitRecognition,
  } = useRecognitionActions(fetchDashboardData);

  const { markAsRead, unread } = useUnread();

  const [isUserStatsModalOpen, setIsUserStatsModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isNewRecognitionModalOpen, setIsNewRecognitionModalOpen] =
    useState(false);

  const {
    bigUpLeaderboard,
    bigUpWall,
    bigUpToMe,
    bigUpFromMe,
    totalBigUp,
    averageBigUpMonthly,
    totalCurrentMonthBigUp,
    yourBigUpStats,
    teamMembers,
    bigUpCategories,
    bigUpUnread,
  } = dashboardData;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 6000);
  }, []);

  const handleProfilePicClick = async (uuid: string) => {
    await fetchUserStats(uuid);
    setIsUserStatsModalOpen(true);
  };

  const handleLeaderboardProfilePicClick = async (uuid: string) => {
    router.push(`/users/${uuid}`);
  };

  const tabsData = createTabsData({
    bigUpLeaderboard,
    bigUpWall,
    bigUpToMe,
    bigUpFromMe,
    handleLeaderboardProfilePicClick,
    handleProfilePicClick,
  });

  const unreadRecognitionModalData = (
    <RecognitionList
      gridTemplateColumns="1fr"
      items={bigUpUnread}
      onClickProfilePic={handleProfilePicClick}
      reverseRecognition={true}
    />
  );

  const masonryData = {
    items: [
      { title: "Company: Total", content: totalBigUp.toLocaleString() },
      {
        title: "Company: Monthly Avg",
        content: averageBigUpMonthly.toFixed(2),
      },
      {
        title: "Company: Current Month",
        content: totalCurrentMonthBigUp.toLocaleString(),
      },
      {
        title: "You: Total Given",
        content: yourBigUpStats?.bigUpGivenPoints.toLocaleString(),
      },
    ],
    userStats: yourBigUpStats,
  };

  const handleCloseNewRecognitionModal = async () => {
    await markAsRead();
    setIsNewRecognitionModalOpen(false);
    setShowConfetti(false);
  };

  const modalData = {
    teamMembers,
    categories: bigUpCategories,
  };

  useEffect(() => {
    if (unread && bigUpUnread.length > 0) {
      setIsNewRecognitionModalOpen(true);
      setShowConfetti(true);
    }

    setTimeout(() => {
      setShowConfetti(false);
    }, 8000);
  }, [bigUpUnread, setShowConfetti]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Flex
        w="100%"
        maxH="100%"
        gap={2}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        backgroundImage="url('/big-up/big-up-app-bg.webp')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        pt={[74, null, null, null]}
        pb={[4, 51, null, null, null]}
        px={[2, null, null, 5]}
        sx={{
          "@media (max-width: 400px)": {
            ...hideScrollbar,
          },
        }}
      >
        <PerygonCard
          display="flex"
          width="100%"
          p={2}
          pr={6}
          alignItems="center"
          bg={theme.components.bigUpStatsCard.baseStyle.elementBG}
        >
          <RecognitionHeader
            headingText="Recognition Hub"
            onAddButtonClick={() => setIsSubmitModalOpen(true)}
          />
        </PerygonCard>

        <Grid
          width={["100%"]}
          gridTemplateColumns={["1fr", null, null, "1fr 2fr"]}
          gap={5}
        >
          <VStack width="100%" gap={5}>
            <BigUpMasonry {...masonryData} />
          </VStack>

          <SpringScale delay={0} style={{ width: "100%" }}>
            <PerygonTabs tabs={tabsData} />
          </SpringScale>

          <SubmitScoreModal
            isOpen={isSubmitModalOpen}
            onClose={() => setIsSubmitModalOpen(false)}
            onSubmit={handleSubmitRecognition}
            teamMembers={modalData.teamMembers}
            categories={modalData.categories}
          />
        </Grid>

        <ConfettiWrapper show={showConfetti} />

        <RecognitionSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setIsSubmitModalOpen(false);
            setShowConfetti(false);
          }}
        />

        <UserStatsModal
          isOpen={isUserStatsModalOpen}
          userStats={userStats}
          onClose={() => setIsUserStatsModalOpen(false)}
          handleProfilePicClick={handleLeaderboardProfilePicClick}
        />

        <NewRecognitionModal
          isOpen={isNewRecognitionModalOpen}
          onClose={handleCloseNewRecognitionModal}
          unreadRecognitionModalData={unreadRecognitionModalData}
        />
      </Flex>
    </>
  );
}
