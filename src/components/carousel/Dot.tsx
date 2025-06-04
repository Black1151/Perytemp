import { Box, useTheme } from "@chakra-ui/react";

interface DotProps {
  isActive: boolean;
  onClick: () => void;
}

const Dot: React.FC<DotProps> = ({ isActive, onClick }) => {
  const theme = useTheme();

  return (
    <Box
      w={[3, null, 4, 5, 6]}
      h={[3, null, 4, 5, 6]}
      borderRadius="full"
      bg={isActive ? theme.colors.primary : "white"}
      cursor="pointer"
      onClick={onClick}
      transition="background-color 0.3s ease"
    />
  );
};

export default Dot;
