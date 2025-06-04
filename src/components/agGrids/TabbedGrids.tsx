"use client";

import React from "react";
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { ColDef } from "ag-grid-community";

interface DataSource {
  data: any[];
  title: string;
  fields: ColDef[];
  createNewUrl?: string;
  createNewUrlButtonText?: string;
  isModalEnabled?: boolean;
  openModalComponent?: React.ElementType;
}

interface TabbedDataGridProps {
  dataSources: DataSource[];
}

const TabbedGrids: React.FC<TabbedDataGridProps> = ({ dataSources }) => {
  if (dataSources.length === 1) {
    // Render only the single panel without tabs
    const source = dataSources[0];
    return (
      <Box borderRadius="md" mt={4}>
        <DataGridComponent
          data={source.data}
          initialFields={source.fields}
          createNewUrl={source.createNewUrl}
          createNewUrlButtonText={source.createNewUrlButtonText}
          isModalEnabled={source.isModalEnabled}
          openModalComponent={source.openModalComponent}
        />
      </Box>
    );
  }

  // Render tabs with panels if there are multiple data sources
  return (
    <Box borderRadius="md" mt={4}>
      <Tabs variant="enclosed" size="md" isFitted>
        <TabList>
          {dataSources.map((source, index) => (
            <Tab
              key={index}
              color={"white"}
              fontSize={["sm", "sm", "md"]}
              _selected={{ color: "white", bg: "#FFFFFF44" }}
            >
              {source.title}
              <Text as="sup" size={"sm"}>
                {source.data.length}
              </Text>
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {dataSources.map((source, index) => (
            <TabPanel key={index} margin={0} p={0}>
              <DataGridComponent
                data={source.data}
                initialFields={source.fields}
                createNewUrl={source.createNewUrl}
                createNewUrlButtonText={source.createNewUrlButtonText}
                isModalEnabled={source.isModalEnabled}
                openModalComponent={source.openModalComponent}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default TabbedGrids;
