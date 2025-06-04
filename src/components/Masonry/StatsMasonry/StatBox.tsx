import Counter from "@/components/counter/Counter";
import PerygonCard from "@/components/layout/PerygonCard";
import {
  Box,
  Flex,
  HStack,
  Image,
  Text,
  useTheme,
  VStack,
} from "@chakra-ui/react";

interface StatBoxProps {
  bgColor: string;
  data: string;
  title: string;
  counterColor?: string;
  titleImage?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({
  bgColor,
  title,
  data,
  counterColor,
  titleImage,
}) => {
  const theme = useTheme();

  return (
    <PerygonCard p={0} borderRadius="2xl">
      <VStack
        bg="elementBG"
        justifyContent="center"
        alignItems="center"
        direction="column"
        borderRadius="2xl"
        overflow="hidden"
      >
        <Flex flex={1} justifyContent="center" alignItems="center" p={6} pb={2}>
          <Counter
            value={parseInt(data)}
            color={counterColor ?? theme.colors.primary}
            fontSize={[40, 50]}
            fontWeight="bold"
            p={8}
          />
        </Flex>
        <HStack
          bg={bgColor}
          flex={2}
          w="100%"
          justifyContent="center"
          p={2}
          alignItems="center"
          gap={2}
        >
          {titleImage && (
            <Box w="40px">
              <Image src={titleImage} />
            </Box>
          )}
          <Text color="white" fontWeight="bold" fontSize={[20, 25]}>
            {title}
          </Text>
        </HStack>
      </VStack>
    </PerygonCard>
  );
};
