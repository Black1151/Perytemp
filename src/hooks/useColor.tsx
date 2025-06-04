import { useTheme } from "@chakra-ui/react";

const useColor = () => {
  const theme = useTheme();

  const getColor = (progress: number) => {
    if (progress <= 2) return "red";
    if (progress <= 6) return theme.colors.yellow;
    if (progress <= 8) return theme.colors.lightGreen;
    return theme.colors.seduloGreen;
  };

  return { getColor };
};

export default useColor;
