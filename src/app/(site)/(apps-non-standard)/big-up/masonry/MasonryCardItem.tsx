import PerygonCard from "@/components/layout/PerygonCard";
import { Flex, Center, Text, useTheme } from "@chakra-ui/react";
import { ReactNode } from "react";

interface MasonryCardProps {
  title: string;
  content: ReactNode;
}

export const MasonryCard: React.FC<MasonryCardProps> = ({ title, content }) => {
  const theme = useTheme();

  return (
    <PerygonCard
      display="flex"
      height="100%"
      width="100%"
      p={4}
      flex="1"
      bg={theme.components.masonryCardItem.baseStyle.elementBG}
    >
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        width="100%"
      >
        <Text
          fontSize={["sm", null, null, "md"]}
          fontWeight="bold"
          color={theme.components.masonryCardItem.baseStyle.primaryTextColor}
        >
          {title}
        </Text>
        <Center flex={1} py={4}>
          <Text
            color={
              theme.components.masonryCardItem.baseStyle.secondaryTextColor
            }
            fontSize={["2xl", null, null, "2xl", null, null, "4xl"]}
          >
            {content}
          </Text>
        </Center>
      </Flex>
    </PerygonCard>
  );
};
