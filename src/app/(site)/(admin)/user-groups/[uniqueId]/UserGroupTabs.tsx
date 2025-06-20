"use client";

import React, { useRef, useState } from "react";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import DraggableGridsComponent from "@/components/agGrids/DraggableGridsComponent";
import { userGroupJson } from "@/components/surveyjs/forms/userGroup";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import { userFieldDefs } from "./userFields";
import { teamFieldDefs } from "./teamFields";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

interface UserGroupsTabsProps {
  userGroupId: string;
  userGroupData: any;
  userPopulationData: any[];
  userSampleData: any[];
  teamPopulationData: any[];
  teamSampleData: any[];
}

const UserGroupsTabs: React.FC<UserGroupsTabsProps> = ({
  userGroupId,
  userGroupData,
  userPopulationData,
  userSampleData,
  teamPopulationData,
  teamSampleData,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [pendingTabIndex, setPendingTabIndex] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [populationCanChange, setPopulationCanChange] = useState<boolean>(true);
  const [sampleCanChange, setSampleCanChange] = useState<boolean>(true);

  // Refs to reset each DraggableGridsComponent
  const populationResetRef = useRef<(() => void) | null>(null);
  const sampleResetRef = useRef<(() => void) | null>(null);

  const handleTabChange = (index: number) => {
    if (
      (activeTabIndex === 1 && !populationCanChange) ||
      (activeTabIndex === 2 && !sampleCanChange)
    ) {
      setPendingTabIndex(index);
      onOpen();
    } else {
      setActiveTabIndex(index);
    }
  };

  const confirmTabChange = () => {
    if (pendingTabIndex !== null) {
      resetCurrentTab(); // Reset current tab before switching
      setActiveTabIndex(pendingTabIndex);
      setPendingTabIndex(null);
    }
    onClose();
  };

  const resetCurrentTab = () => {
    if (activeTabIndex === 1 && populationResetRef.current) {
      populationResetRef.current();
    } else if (activeTabIndex === 2 && sampleResetRef.current) {
      sampleResetRef.current();
    }
  };

  const onUndoStackChangePopulation = (hasUndoStack: boolean) => {
    setPopulationCanChange(!hasUndoStack);
  };

  const onUndoStackChangeSample = (hasUndoStack: boolean) => {
    setSampleCanChange(!hasUndoStack);
  };

  return (
    <>
      <Tabs
        variant="enclosed"
        size="md"
        isFitted
        index={activeTabIndex}
        onChange={handleTabChange}
      >
        <TabList>
          <Tab
            color={"white"}
            fontSize={["xs", "sm", "md"]}
            _selected={{ color: "white", bg: "#FFFFFF44" }}
          >
            Edit User Group
          </Tab>
          <Tab
            color={"white"}
            fontSize={["xs", "sm", "md"]}
            _selected={{ color: "white", bg: "#FFFFFF44" }}
          >
            User Group Members
          </Tab>
          <Tab
            color={"white"}
            fontSize={["xs", "sm", "md"]}
            _selected={{ color: "white", bg: "#FFFFFF44" }}
          >
            Department / Team Group Members
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <AdminFormWrapper
              formJson={userGroupJson}
              data={userGroupData}
              layoutConfig={{
                layoutKey: "default",
                layoutProps: {},
              }}
              globalVariables={[]}
              stylingConfig={{
                sjsFilePath: "admin",
                cssFilePath: "admin",
              }}
              jsImport={""}
              excludeKeys={[]}
              endpoint={`/userGroup/${userGroupId}`}
              formSuccessMessage={null}
              reloadPageOnSuccess={true}
              redirectUrl={"/business-processes"}
              isNew={false}
              isAllowedToEdit={true}
            />
          </TabPanel>
          <TabPanel p={0}>
            <DraggableGridsComponent
              populationData={userPopulationData}
              populationTitle="Users"
              sampleData={userSampleData}
              sampleTitle="Users in group"
              endpoint={`/api/userGroup/many/${userGroupId}`}
              fieldDefs={userFieldDefs}
              dynamicIdField="id"
              mappingField="userId"
              payloadKey="users"
              submitTitle={"Save Users"}
              onUndoStackChange={onUndoStackChangePopulation}
              resetRef={populationResetRef} // Pass the resetRef
            />
          </TabPanel>
          <TabPanel p={0}>
            <DraggableGridsComponent
              populationData={teamPopulationData}
              populationTitle="Dept / Teams"
              sampleData={teamSampleData}
              sampleTitle="Dept / Teams in group"
              endpoint={`/api/userGroup/many/${userGroupId}`}
              fieldDefs={teamFieldDefs}
              dynamicIdField="id"
              mappingField="teamId"
              payloadKey="teams"
              submitTitle={"Save Dept / Teams"}
              onUndoStackChange={onUndoStackChangeSample}
              resetRef={sampleResetRef} // Pass the resetRef
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Confirmation Modal */}
      <SurveyModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmTabChange}
        title="Unsaved Changes"
        bodyContent="You may have unsaved changes. Are you sure you want to move tabs?"
        confirmLabel="Yes, Proceed"
        cancelLabel="Stay"
      />
    </>
  );
};

export default UserGroupsTabs;
