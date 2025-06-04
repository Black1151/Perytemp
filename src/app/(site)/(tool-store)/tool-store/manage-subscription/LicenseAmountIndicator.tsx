import {
  Avatar,
  AvatarGroup,
  VStack,
  Wrap,
  WrapItem,
  Badge,
} from "@chakra-ui/react";
import { Person } from "@mui/icons-material";

const LicenseAmountIndicator = ({ amount }: { amount: number }) => {
  if (amount === 0) {
    return (
      <AvatarGroup size="lg" max={4} spacing={-3}>
        {Array.from({ length: 20 }).map((_, idx) => (
          <VStack key={idx} spacing={0} align="center">
            <Avatar key={idx} size="lg" icon={<Person fontSize="large" />} />
            <Badge colorScheme="green">Free</Badge>
          </VStack>
        ))}
      </AvatarGroup>
    );
  }

  return (
    <AvatarGroup size="lg" max={4} spacing={-2}>
      {Array.from({ length: amount }).map((_, idx) => (
        <Avatar key={idx} size="lg" icon={<Person fontSize="large" />} />
      ))}
    </AvatarGroup>
  );
};

export default LicenseAmountIndicator;
