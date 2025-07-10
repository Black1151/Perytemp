import {
  Flex,
  VStack,
  Badge,
  Text,
  Link as ChakraLink,
  IconButton,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LinkIcon from "@mui/icons-material/Link";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { ReactNode } from "react";

export type InfoKind = "tel" | "email" | "link" | "code";

interface InfoRowProps {
  type: InfoKind;
  value: string;
  isPreview: boolean;
  onCopy(value: string): void;
}

/* central table for icon + badge label */
const INFO_META: Record<
  InfoKind,
  { icon: React.ComponentType<any>; label: string }
> = {
  tel: { icon: PhoneOutlinedIcon, label: "Telephone" },
  email: { icon: EmailOutlinedIcon, label: "Email" },
  link: { icon: LinkIcon, label: "Link" },
  code: { icon: LocalOfferIcon, label: "Code" },
};

export default function InfoRow({
  type,
  value,
  isPreview,
  onCopy,
}: InfoRowProps) {
  const { icon: Icon, label } = INFO_META[type];

  const textNode: ReactNode =
    type === "link" ? (
      <ChakraLink
        href={value.startsWith("http") ? value : `https://${value}`}
        isExternal
        flex={1}
        minW={0}
        isTruncated
        fontWeight={500}
        title={value}
      >
        {value}
      </ChakraLink>
    ) : (
      <Text
        flex={1}
        minW={0}
        isTruncated
        fontWeight={500}
        title={value}
        userSelect="none"
      >
        {value}
      </Text>
    );

  return (
    <VStack align="start" spacing={2} w="100%">
      <Badge
        bg="hospitalityHubPremium"
        color="black"
        variant="subtle"
        fontSize="md"
      >
        {label}
      </Badge>

      <Box
        display="flex"
        alignItems="center"
        minWidth={0}
        gap={2}
        overflow="hidden"
        w="100%"
      >
        <Box
          p={4}
          bg="gray.800"
          display="flex"
          alignItems="center"
          flex={1}
          gap={3}
          minW={0}
          w="60vw"
          maxW="500px"
          border="1px solid"
          borderColor="gray.700"
          borderRadius="lg"
        >
          <Icon style={{ color: "#F6C90E", fontSize: 28 }} />
          {textNode}
        </Box>
        <Tooltip label={isPreview ? "Disabled in preview mode" : "Copy"}>
          <IconButton
            aria-label="Copy"
            border="1px solid"
            borderColor="gray.600"
            borderRadius="lg"
            icon={<ContentCopyIcon />}
            size="lg"
            bg="gray.700"
            _hover={{ bg: "gray.600" }}
            onClick={() => onCopy(value)}
            height="auto"
            minW="unset"
            w="56px"
            h="auto"
            alignSelf="stretch"
            color={"white"}
            isDisabled={isPreview}
          />
        </Tooltip>
      </Box>
    </VStack>
  );
}
