import { hideScrollbar } from "@/utils/style/style-utils";
import {
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  Text,
  useTheme,
} from "@chakra-ui/react";
import { transparentize } from "polished";

export interface PerygonTabsProps {
  tabs: { header: string; content: JSX.Element }[];
}

export const PerygonTabs: React.FC<PerygonTabsProps> = ({ tabs }) => {
  const theme = useTheme();

  return (
    <Tabs
      display="flex"
      flexDirection="column"
      width="100%"
      height="80vh"
      bg={transparentize(0.3, theme.colors.elementBG2)}
      border="primaryBorder"
      borderRadius="lg"
    >
      <TabList justifyContent="space-between">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            flex="1"
            textAlign="center"
            color={theme.colors.primaryTextColor}
            bg="elementBG"
            borderTopRadius="lg"
            _selected={{
              color: "white",
              bg: "primary",
              borderTopRadius: "lg",
            }}
          >
            <Text>{tab.header}</Text>
          </Tab>
        ))}
      </TabList>

      <TabPanels
        flex="1"
        overflowY="auto"
        sx={{
          "@media (max-width: 400px)": {
            ...hideScrollbar,
          },
        }}
      >
        {tabs.map((tab, index) => (
          <TabPanel key={index}>{tab.content}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
