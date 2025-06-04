import { ModalContent, ModalContentProps } from "@chakra-ui/react";

interface BigUpModalContentProps extends ModalContentProps {
  children: React.ReactNode;
}

export const BigUpModalContent: React.FC<BigUpModalContentProps> = ({
  children,
}) => {
  return (
    <ModalContent
      bg="elementBG"
      // boxShadow="0 0 10px 2px var(--chakra-colors-primary)"
      boxShadow="primaryShadow"
      mx={4}
    >
      {children}
    </ModalContent>
  );
};
