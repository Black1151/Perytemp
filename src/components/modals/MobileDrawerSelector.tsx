import {
    Drawer, DrawerOverlay, DrawerContent, DrawerHeader,
    DrawerBody, Button, HStack, Text, Icon, VStack, Box,
    useDisclosure, useTheme, IconButton,
    Badge,
    InputGroup, InputLeftElement, Input
} from "@chakra-ui/react";
import { KeyboardArrowDown, Check, Close as CloseIcon } from "@mui/icons-material";
import { transparentize } from "@chakra-ui/theme-tools";
import { ReactNode, ReactElement } from "react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";

type Item = {
    id: string | number;
    label: React.ReactNode | string;
    isActive?: boolean;
    content: ReactNode;
    searchableLabel?: string;
};

type Props = {
    items: Item[];
    selectedId?: string | number;
    onSelect: (id: string | number) => void;
    triggerLabel?: ReactNode;
    enableSearch?: boolean;
};

export default function MobileDrawerSelector({
    items,
    selectedId,
    onSelect,
    triggerLabel,
    enableSearch,
}: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const sel = items.find(i => i.id === selectedId);
    const theme = useTheme();
    const bg = theme.colors.elementBG;
    const borderColor = transparentize(theme.colors.primaryTextColor, 0.15)(theme);
    const successColor = theme.colors.green[500];
    const errorColor = theme.colors.red[500];
    const primaryTextColor = theme.colors.primaryTextColor;
    const [search, setSearch] = React.useState("");

    const filteredItems = enableSearch && isOpen
        ? items.filter(it =>
            typeof it.searchableLabel === "string" &&
            it.searchableLabel.toLowerCase().includes(search.toLowerCase())
        )
        : items;

    return (
        <>
            <Button
                width="100%"
                onClick={onOpen}
                rightIcon={<KeyboardArrowDown />}
                bg={bg}
                _active={{ bg: transparentize(bg, 0.9)(theme) }}
            >
                <HStack w="100%" justifyContent="space-between">
                    <Text flex="1" textAlign="left" isTruncated color={primaryTextColor} fontWeight={"normal"}>
                        {triggerLabel ?? sel?.content ?? "Select…"}
                    </Text>

                    {sel && sel.isActive !== undefined && (
                        <Box
                            as="span"
                            display="inline-block"
                            w="12px"
                            h="12px"
                            borderRadius="full"
                            bg={sel.isActive ? successColor : errorColor}
                        />
                    )}
                </HStack>
            </Button>

            <Drawer placement="bottom" onClose={onClose} isOpen={isOpen} size="full">
                <DrawerOverlay />
                <DrawerContent bg={bg} borderTopRadius={theme.radii.md} h={"92vh"}>
                    <DrawerHeader
                        borderBottom="1px solid"
                        borderColor={borderColor}
                        fontWeight="medium"
                        p={4}
                    >
                        <HStack justifyContent="space-between" alignItems="center">
                            <Text color={primaryTextColor} fontWeight={"semibold"}>Choose an option</Text>
                            <IconButton
                                aria-label="Close drawer"
                                icon={<CloseIcon sx={{ fontSize: 28 }} />}
                                size="md"
                                variant="ghost"
                                color={primaryTextColor}
                                onClick={onClose}
                            />
                        </HStack>
                        {enableSearch && (
                            <InputGroup mt={4}>
                                <InputLeftElement pointerEvents="none" color="gray.400">
                                    <SearchIcon fontSize="small" />
                                </InputLeftElement>
                                <Input
                                    placeholder="Search..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    bg="white"
                                    color="gray.800"
                                />
                            </InputGroup>
                        )}
                    </DrawerHeader>

                    <DrawerBody p={0}>
                        <VStack align="stretch" spacing={2} divider={
                            <Box borderBottom="1px solid" borderColor={borderColor} />
                        }>
                            <AnimatePresence initial={false}>
                              {filteredItems.map((it, idx) => (
                                <React.Fragment key={it.id}>
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.18, type: "tween" }}
                                    style={{ width: "100%"}}
                                  >
                                    <Button
                                      justifyContent="space-between"
                                      alignContent={"center"}
                                      variant="ghost"
                                      borderRadius={0}
                                      px={4} py={8}
                                      _hover={{ bg: transparentize(bg, 0.8)(theme) }}
                                      onClick={() => { onSelect(it.id); onClose(); }}
                                      w="100%"
                                    >
                                      <Text flex="1" textAlign="left" isTruncated color={primaryTextColor} fontWeight={"normal"}>{it.content}</Text>
                                      {it.isActive !== undefined && (
                                          it.isActive
                                              ? <Badge colorScheme="green">Active</Badge>
                                              : <Badge colorScheme="red">Inactive</Badge>
                                      )}
                                    </Button>
                                  </motion.div>
                                  {idx < filteredItems.length - 1 && (
                                    <Box h="1px" w="100%" bg={borderColor} opacity={0.4} />
                                  )}
                                </React.Fragment>
                              ))}
                            </AnimatePresence>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
