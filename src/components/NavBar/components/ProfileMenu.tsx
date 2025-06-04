import React from "react";
import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
  Flex,
  Text,
  useTheme,
  useBreakpointValue,
  Select,
  HStack,
  VStack,
} from "@chakra-ui/react";
import PersonIcon from "@mui/icons-material/Person";
import {
  AccessTime,
  Celebration,
  ExitToApp,
  Palette,
} from "@mui/icons-material";

import PulsatingIcon from "./PulsatingIcon";
import { MenuItemProps } from "./types";
import { useThemeContext } from "@/providers/ChakraThemeProvider";
import { ThemeDropdownOption } from "../NavBar";

interface ProfileMenuProps {
  userImageUrl: string;
  menuItems: MenuItemProps[];
  unread: boolean;
  themeDropdownOptions: ThemeDropdownOption[];
  handleLogout: () => void;
  userIsFree: boolean;
  userIsFreeUntil: string;
  userIsFreeAction: () => void;
  userRole: string;
}

function daysLeft(freeUntil: string): string {
  const [year, month, day] = freeUntil.split("-").map(Number);
  const endDate = new Date(Date.UTC(year, month - 1, day));

  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = endDate.getTime() - todayUTC.getTime();
  const diffDays = Math.ceil(diffMs / msPerDay);

  if (diffDays <= 0) {
    return "Expired";
  }
  return `${diffDays} day${diffDays === 1 ? "" : "s"} left`;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  userImageUrl,
  menuItems,
  unread,
  themeDropdownOptions,
  handleLogout,
  userIsFree,
  userIsFreeUntil,
  userIsFreeAction,
  userRole,
}) => {
  const theme = useTheme();
  const { setThemeId, themeId } = useThemeContext();

  const pulsatingIconSize = useBreakpointValue({ base: 20, md: 25 });

  return (
    // Prevent auto-closing while interacting with the Select
    <Menu closeOnSelect={false}>
      <Box position="relative">
        <MenuButton
          as={Box}
          borderRadius="50%"
          overflow="hidden"
          width="40px"
          height="40px"
          _hover={{ cursor: "pointer" }}
        >
          {userImageUrl ? (
            <Image
              src={userImageUrl}
              alt="profile pic"
              width="100%"
              height="100%"
              objectFit="cover"
            />
          ) : (
            <Flex
              bg="gray.100"
              width="full"
              height="full"
              align="center"
              justify="center"
            >
              <PersonIcon
                sx={{
                  color: theme.colors.primary,
                  width: "100%",
                  height: "100%",
                }}
              />
            </Flex>
          )}
        </MenuButton>

        {unread && (
          <PulsatingIcon
            icon={
              <Celebration
                sx={{
                  color: "white",
                  height: "15px",
                  width: "15px",
                }}
              />
            }
            size={pulsatingIconSize}
          />
        )}
      </Box>

      <MenuList bg="elementBG" color={theme.colors.themeTextColor} px={2}>
        {userIsFree && (
          <HStack
            px={4}
            pr={8}
            py={4}
            bgColor={theme.colors.primary}
            justifyContent="left"
            alignItems="center"
            fontSize={[16, 18, 18]}
            borderRadius={"md"}
            color={theme.colors.white}
            cursor={"pointer"}
            mb={2}
            gap={4}
          >
            <AccessTime fontSize="large" />
            <VStack spacing={0} align={"left"}>
              <Text fontWeight={"semibold"}>Free Trial</Text>
              <HStack spacing={1} alignItems="center" justify={"center"}>
                <Text fontSize={"14"} color="whiteAlpha.900">
                  {daysLeft(userIsFreeUntil)} -
                </Text>
                {(userRole == "CA" || "CL") && (
                  <Text
                    fontSize={"12"}
                    color="whiteAlpha.800"
                    decoration="underline"
                    onClick={(e) => {
                      userIsFreeAction();
                      // Close the menu & force the menu to close
                      const menu = e.currentTarget.closest('[role="menu"]');
                      if (menu) {
                        const button = document.querySelector(
                          '[aria-haspopup="menu"][aria-expanded="true"]'
                        );
                        if (button instanceof HTMLElement) {
                          button.click();
                        }
                      }
                    }}
                  >
                    Upgrade Now
                  </Text>
                )}
              </HStack>
            </VStack>
          </HStack>
        )}

        {menuItems
          .sort((a, b) => (a.orderGroup ?? 0) - (b.orderGroup ?? 0))
          .map((item) => (
            <MenuItem
              closeOnSelect
              key={item.label}
              fontSize={[14, 16, 18]}
              display="flex"
              alignItems="center"
              position="relative"
              overflow="hidden"
              bg="elementBG"
              borderRadius="md"
              _hover={{
                backgroundColor: theme.colors.primary,
                color: "white",
              }}
              onClick={item.onClick}
            >
              {item.icon}
              <Text flex={1} zIndex={2} ml={2}>
                {item.label}
              </Text>
            </MenuItem>
          ))}

        {themeDropdownOptions[0] && (
          <HStack px={3} py={2}>
            <Palette />
            <Select
              fontSize={16}
              value={themeId!}
              onChange={(e) => setThemeId(Number(e.target.value))}
              bg="elementBG"
              borderColor={theme.colors.primary}
              maxWidth="210px"
              sx={{
                fontSize: [14, 16, 18],
                option: {
                  backgroundColor: theme.colors.elementBG,
                },
              }}
            >
              {themeDropdownOptions.map((themeOption) => (
                <option
                  key={themeOption.value}
                  value={themeOption.value}
                  disabled={!!themeOption.locked}
                >
                  {themeOption.label}
                  {themeOption.locked ? "🔒" : ""}
                </option>
              ))}
            </Select>
          </HStack>
        )}

        <MenuItem
          closeOnSelect
          key="logout"
          fontSize={[14, 16, 18]}
          display="flex"
          alignItems="center"
          position="relative"
          overflow="hidden"
          bg="elementBG"
          borderRadius="md"
          _hover={{
            backgroundColor: theme.colors.primary,
            color: "white",
          }}
          onClick={handleLogout}
        >
          <ExitToApp />
          <Text flex={1} zIndex={2} ml={2}>
            Logout
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
