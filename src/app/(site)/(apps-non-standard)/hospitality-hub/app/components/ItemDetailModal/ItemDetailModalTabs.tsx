import React from "react";
import { Box, Flex, Tabs, TabList, TabPanels, TabPanel, Tab, Text } from "@chakra-ui/react";
import MobileDrawerSelector from "@/components/modals/MobileDrawerSelector";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailableOutlined";
import { ItemDetailModalTabsProps, DrawerItem } from "./types";

const ItemDetailModalTabs: React.FC<ItemDetailModalTabsProps> = ({ drawerItems, tabIndex, setTabIndex, isMobile }) => {
  if (drawerItems.length === 0) return null;
  if (isMobile) {
    return drawerItems.length === 1 ? (
      <Box px={4} py={4} w="100%">
        {drawerItems[tabIndex]?.content}
      </Box>
    ) : (
      <>
        <Flex px={4} py={2}>
          <MobileDrawerSelector
            items={drawerItems.map((item, idx) => ({
              id: idx,
              label: item.label,
              content: <Text>{item.label}</Text>,
            }))}
            selectedId={tabIndex}
            onSelect={(id) => setTabIndex(Number(id))}
            triggerLabel={drawerItems[tabIndex]?.label}
          />
        </Flex>
        <Box px={4} py={4} w="100%">
          {drawerItems[tabIndex]?.content}
        </Box>
      </>
    );
  }
  // Desktop
  const tabCount = drawerItems.length;
  if (tabCount === 1) {
    return (
      <Box px={[2, 8]} py={[4, 8]} w="100%">
        {drawerItems[0].content}
      </Box>
    );
  }
  return (
    <Tabs
      isFitted
      variant="soft-rounded"
      w="100%"
      flex={1}
      index={tabIndex}
      onChange={setTabIndex}
    >
      <TabList px={[2, 8]}>
        {drawerItems.map((i) => (
          <Tab
            key={i.id}
            color="hospitalityHubPremium"
            _selected={{
              bg: "hospitalityHubPremium",
              color: "black",
              svg: { color: "black" },
            }}
          >
            {i.id === "details" && <InfoIcon style={{ marginRight: 8 }} />}
            {i.id === "location" && <LocationOnIcon style={{ marginRight: 8 }} />}
            {i.id === "booking" && <EventAvailableIcon style={{ marginRight: 8 }} />}
            {i.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {drawerItems.map((i) => (
          <TabPanel key={i.id} px={[2, 8]} py={[4, 8]} h="100%">
            {i.content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default ItemDetailModalTabs; 