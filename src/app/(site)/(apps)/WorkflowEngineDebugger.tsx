import { useUser } from "@/providers/UserProvider";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Box,
  Text,
  Code,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

type DebugEntry = {
  label: string;
  value: any;
};

type Props = {
  data: DebugEntry[];
};

const WorkflowEngineDebugger = ({ data }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { showDeveloperBoard } = useUser();

  const isDevelopment = process.env.NODE_ENV === "development";
  const shouldRender = isDevelopment || (!isDevelopment && showDeveloperBoard);

  if (!shouldRender) return null;

  return (
    <>
      {/* Debug Button */}
      <Box position="fixed" bottom="4" left="4" zIndex="9999">
        <Button size="sm" colorScheme="gray" onClick={onOpen}>
          Debug State (DEV)
        </Button>
      </Box>

      {/* Debug Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="6xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>🔍 Current State Snapshot</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted variant="enclosed">
              <TabList>
                {data.map(({ label }, idx) => (
                  <Tab key={idx}>{label}</Tab>
                ))}
              </TabList>
              <TabPanels>
                {data.map(({ value }, idx) => (
                  <TabPanel key={idx}>
                    <Code
                      p={4}
                      whiteSpace="pre-wrap"
                      width="100%"
                      display="block"
                    >
                      {JSON.stringify(value, null, 2)}
                    </Code>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WorkflowEngineDebugger;
