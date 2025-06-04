import { Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import BackButton from "@/components/BackButton";

interface AdminHeadingProps {
  headingText: string;
  dataCount?: number;
}

const AdminHeading: React.FC<AdminHeadingProps> = ({
  headingText,
  dataCount,
}) => {
  return (
    <Flex
      color="white"
      width="full"
      borderBottom="1px solid white"
      gap={2}
      alignItems="flex-start"
    >
      <BackButton />
      <Heading
        as="h1"
        fontSize={["xl", "2xl", "3xl"]}
        fontFamily={"Bonfire"}
        fontWeight={100}
      >
        {headingText}{" "}
      </Heading>
      {dataCount && (
        <Text as="sup" fontSize="xs">
          {dataCount > 0 ? dataCount : 0}
        </Text>
      )}
    </Flex>
  );
};

export default AdminHeading;
