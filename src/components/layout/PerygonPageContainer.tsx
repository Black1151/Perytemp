import { VStack } from "@chakra-ui/react";

interface PerygonPageContainerProps {
  children: React.ReactNode;
  bgColor?: string;
}

export default function PerygonPageContainer({
  children,
}: PerygonPageContainerProps) {
  return (
    <VStack maxHeight={"100vh"} width={"100%"} overflow="hidden">
      {children}
    </VStack>
  );
}
