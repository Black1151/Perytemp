import { Flex, Text, theme, useTheme } from "@chakra-ui/react";
import PerygonCard from "../layout/PerygonCard";

interface SectionHeaderProps {
  children: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <PerygonCard p={2} px={4} justifyContent="center">
      <Text color={theme.colors.primary} fontSize={["sm", "lg"]}>
        {children}
      </Text>
    </PerygonCard>
  );
};
