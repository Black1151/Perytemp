import React from "react";
import { Center, HStack, Text } from "@chakra-ui/react";
import PeopleIcon from "@mui/icons-material/People";
import { ICellRendererParams } from "ag-grid-community";

const PeopleIconRenderer: React.FC<ICellRendererParams> = ({data}) => {
  if (!data) return null;
  const { numberOfPeople } = data;

  return (
    <HStack h="100%" justify={"end"}>
      <Text>{numberOfPeople}</Text>
      <PeopleIcon style={{ fontSize: 22, color: "white" }} />
    </HStack>
  );
};

export default PeopleIconRenderer;
