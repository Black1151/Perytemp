// components/NavBar/GreetingText.tsx
import React from "react";
import { Text } from "@chakra-ui/react";

interface GreetingTextProps {
  userFirstName: string;
}

const GreetingText: React.FC<GreetingTextProps> = ({ userFirstName }) => {
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 12) return "Good Morning";
    if (currentHour >= 12 && currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <Text display={["none", null, "block"]} color="white" fontSize={18}>
      {getGreeting()}, {userFirstName}!
    </Text>
  );
};

export default GreetingText;
