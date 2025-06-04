// Adjust paths to match your actual structure:
import { LeaderBoardTabContent } from "../tabs/LeaderBoardTab/LeaderBoardTabContent";
import { RecognitionList } from "../tabs/OtherTabs/RecognitionCardList";
import { BigUpLeaderboardEntry, BigUpWallEntry } from "../types";

/** Props needed to create the tab data */
interface CreateTabsDataProps {
  bigUpLeaderboard: BigUpLeaderboardEntry[];
  bigUpWall: BigUpWallEntry[];
  bigUpToMe: BigUpWallEntry[];
  bigUpFromMe: BigUpWallEntry[];
  handleLeaderboardProfilePicClick: (uuid: string) => void;
  handleProfilePicClick: (uuid: string) => void;
}

/**
 * Creates the array of tabs for the PerygonTabs component.
 */
export function createTabsData({
  bigUpLeaderboard,
  bigUpWall,
  bigUpToMe,
  bigUpFromMe,
  handleLeaderboardProfilePicClick,
  handleProfilePicClick,
}: CreateTabsDataProps) {
  return [
    {
      header: "Leader Board",
      content: (
        <LeaderBoardTabContent
          items={bigUpLeaderboard}
          onClickProfilePic={handleLeaderboardProfilePicClick}
        />
      ),
    },
    {
      header: "The Wall",
      content: (
        <RecognitionList
          items={bigUpWall}
          onClickProfilePic={handleProfilePicClick}
        />
      ),
    },
    {
      header: "To Me",
      content: (
        <RecognitionList
          items={bigUpToMe}
          reverseRecognition={true}
          onClickProfilePic={handleProfilePicClick}
        />
      ),
    },
    {
      header: "From Me",
      content: (
        <RecognitionList
          items={bigUpFromMe}
          onClickProfilePic={handleProfilePicClick}
        />
      ),
    },
  ];
}
