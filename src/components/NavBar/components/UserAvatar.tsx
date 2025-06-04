// components/NavBar/UserAvatar.tsx
import React from "react";
import { Image, Flex, Text } from "@chakra-ui/react";

interface UserAvatarProps {
  user: any;
  userRole: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, userRole }) => {
  if (userRole === "EU") {
    if (user?.parentCustImageUrl) {
      return (
        <Image
          src={user.parentCustImageUrl}
          alt={user.customerName || "User"}
          maxHeight="40px"
          maxWidth={["80px", "unset"]}
          objectFit="cover"
          borderRadius="md"
        />
      );
    }
    return (
      <Flex
        bg="white"
        border="1px solid primary"
        align="center"
        justify="center"
        borderRadius="full"
        minH="40px"
        aspectRatio={1}
      >
        <Text fontSize="md" fontWeight="bold" color="primary">
          {user?.customerName?.charAt(0)?.toUpperCase() || ""}
        </Text>
      </Flex>
    );
  } else {
    if (user?.custImageUrl) {
      return (
        <Image
          src={user.custImageUrl}
          alt={user.customerName || "User"}
          maxHeight="40px"
          maxWidth={["80px", "unset"]}
          objectFit="cover"
          borderRadius="md"
        />
      );
    }
    return (
      <Flex
        bg="white"
        border="1px solid primary"
        align="center"
        justify="center"
        borderRadius="full"
        minH="40px"
        aspectRatio={1}
      >
        <Text fontSize="md" fontWeight="bold" color="primary">
          {user?.customerName?.charAt(0)?.toUpperCase() || ""}
        </Text>
      </Flex>
    );
  }
};

export default UserAvatar;
