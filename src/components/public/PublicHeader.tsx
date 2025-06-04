import React from "react";
import {
  Button,
  Flex,
  Heading,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Menu as MenuIcon } from "@mui/icons-material";

const menuItems = [
  { title: "Home", link: "/privacy-policy" },
  { title: "Marketing", link: "/marketing" },
  { title: "Support", link: "/support" },
  { title: "Delete My Data", link: "/delete-my-data" },
  { title: "Perygon Login", link: "/login" },
];

const PublicHeader = () => {
  return (
    <Flex justify={"space-between"} align={"center"} w={["95%", "90%", "85%"]}>
      <Heading
        fontFamily="bonfire"
        color="white"
        fontSize="48px"
        fontWeight="400"
      >
        Perygon
      </Heading>

      <Menu>
        <MenuButton
          as={Button}
          bg="transparent"
          color="white"
          border="1px solid white"
          _hover={{ bg: "primary" }}
          _active={{ bg: "white", color: "primary" }}
        >
          <MenuIcon />
        </MenuButton>
        <MenuList>
          {menuItems.map((item) => (
            <MenuItem as={Link} href={item.link} key={item.link}>
              {item.title}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default PublicHeader;
