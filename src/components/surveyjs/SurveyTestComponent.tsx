"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  useTheme,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { LayoutKeys } from "@/types/form";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

interface SurveyTestComponentProps {
  cssFiles: string[];
  sjsFiles: string[];
  jsFiles: string[];
}

const SurveyTestComponent: React.FC<SurveyTestComponentProps> = ({
  cssFiles,
  sjsFiles,
  jsFiles,
}) => {
  const [isBuildingScreen, setIsBuildingScreen] = useState(true);
  const [surveyJson, setSurveyJson] = useState("");
  const [datasetJson, setDatasetJson] = useState("{}");
  const [layout, setLayout] = useState<LayoutKeys>("default");
  const [endpoint, setEndpoint] = useState("/test");
  const [cssPath, setCssPath] = useState(
    cssFiles.includes("admin") ? "admin" : "",
  );
  const [sjsPath, setSjsPath] = useState(
    sjsFiles.includes("admin") ? "admin" : "",
  );
  const [jsPath, setJsPath] = useState("");
  const [jsonError, setJsonError] = useState(false);
  const [datasetError, setDatasetError] = useState(false);
  const toast = useToast();
  const theme = useTheme();

  const handleSubmit = () => setIsBuildingScreen(false);

  const handleReset = () => setIsBuildingScreen(true);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setSurveyJson(input);
    try {
      const parsedSurveyJson = JSON.parse(input);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
      parsedSurveyJson.pages?.forEach((page: any) => {
        page.elements?.forEach((element: any) => {
          if (element.choicesByUrl?.url) {
            element.choicesByUrl.url = element.choicesByUrl.url.replace(
              "NEXT_PUBLIC_BASE_URL",
              baseUrl,
            );
          }
        });
      });
      setSurveyJson(JSON.stringify(parsedSurveyJson, null, 2));
      setJsonError(false);
    } catch {
      setJsonError(true);
    }
  };

  const handleDatasetChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setDatasetJson(input || "{}");
    try {
      JSON.parse(input);
      setDatasetError(false);
    } catch {
      setDatasetError(true);
    }
  };

  const generateDatasetTemplate = () => {
    try {
      const parsedSurveyJson = JSON.parse(surveyJson);
      const datasetTemplate = parsedSurveyJson.pages?.reduce(
        (acc: any, page: any) => {
          page.elements?.forEach((element: any) => {
            if (element.name) acc[element.name] = null;
          });
          return acc;
        },
        {},
      );
      setDatasetJson(JSON.stringify(datasetTemplate, null, 2));
      toast({
        title: "Dataset template generated!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error generating dataset template. Check Survey JSON.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="100%" py={12} px={{ base: 4, lg: 8 }}>
      <Heading as="h2" size="xl" textAlign="center" color="white" mb={8}>
        Form Builder
      </Heading>
      <Flex
        direction="column"
        mx="auto"
        bg={isBuildingScreen ? "white" : "transparent"}
        p={8}
        borderRadius="md"
        boxShadow="lg"
      >
        {isBuildingScreen ? (
          <VStack spacing={6} w="100%">
            <FormControl isInvalid={jsonError}>
              <FormLabel color="gray.600">Survey JSON</FormLabel>
              <Textarea
                placeholder="Enter Survey JSON here"
                value={surveyJson}
                onChange={handleJsonChange}
                height="180px"
                resize="vertical"
                variant="filled"
                _focus={{ borderColor: theme.colors.primary }}
              />
              {jsonError && (
                <FormErrorMessage>Invalid JSON format</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={datasetError}>
              <FormLabel color="gray.600">
                Dataset JSON (Prefill Data)
              </FormLabel>
              <Textarea
                placeholder="Enter Dataset JSON to prefill survey"
                value={datasetJson}
                onChange={handleDatasetChange}
                height="180px"
                resize="vertical"
                variant="filled"
                _focus={{ borderColor: theme.colors.primary }}
              />
              {datasetError && (
                <FormErrorMessage>Invalid JSON format</FormErrorMessage>
              )}
            </FormControl>

            <Button
              variant="primary"
              onClick={generateDatasetTemplate}
              isDisabled={!surveyJson || jsonError}
            >
              Generate Dataset Template
            </Button>

            <FormControl>
              <FormLabel color="gray.600">Select Layout</FormLabel>
              <Select
                placeholder="Select Layout"
                value={layout}
                onChange={(e) => setLayout(e.target.value as LayoutKeys)}
                variant="filled"
                sx={{
                  option: {
                    backgroundColor: theme.colors.elementBG,
                  },
                }}
              >
                <option value="default">Default</option>
                <option value="happiness">Happiness</option>
                <option value="enps">eNPS</option>
                <option value="client-satisfaction">Client Satisfaction</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel color="gray.600">API Endpoint</FormLabel>
              <Input
                placeholder="Enter API Endpoint"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                variant="filled"
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.600">CSS Path</FormLabel>
              <Select
                placeholder="Select CSS Path"
                value={cssPath}
                onChange={(e) => setCssPath(e.target.value)}
                variant="filled"
                sx={{
                  option: {
                    backgroundColor: theme.colors.elementBG,
                  },
                }}
              >
                {cssFiles.map((file) => (
                  <option key={file} value={file}>
                    {file}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel color="gray.600">SurveyJS Path</FormLabel>
              <Select
                placeholder="Select SurveyJS Path"
                value={sjsPath}
                onChange={(e) => setSjsPath(e.target.value)}
                variant="filled"
                sx={{
                  option: {
                    backgroundColor: theme.colors.elementBG,
                  },
                }}
              >
                {sjsFiles.map((file) => (
                  <option key={file} value={file}>
                    {file}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel color="gray.600">JS Path</FormLabel>
              <Select
                placeholder="Select JavaScript Path"
                value={jsPath}
                onChange={(e) => setJsPath(e.target.value)}
                variant="filled"
                sx={{
                  option: {
                    backgroundColor: theme.colors.elementBG,
                  },
                }}
              >
                {jsFiles.map((file) => (
                  <option key={file} value={file}>
                    {file}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="primary"
              onClick={handleSubmit}
              isDisabled={jsonError || datasetError || !endpoint || !layout}
            >
              {jsonError || datasetError
                ? "Correct JSON to Continue"
                : "Build Survey"}
            </Button>
          </VStack>
        ) : (
          <Box w="100%">
            <Button mt={4} colorScheme="gray" onClick={handleReset} mb={8}>
              Back to Builder
            </Button>
            <Button
              position={"fixed"}
              zIndex={999}
              top={4}
              left={4}
              mt={4}
              colorScheme="gray"
              onClick={handleReset}
              mb={8}
            >
              Back to Builder
            </Button>
            <AdminFormWrapper
              isNew={datasetJson === "{}"}
              reloadPageOnSuccess={false}
              formJson={JSON.parse(surveyJson)}
              data={JSON.parse(datasetJson)}
              layoutConfig={{
                layoutKey: layout,
                layoutProps: {},
              }}
              stylingConfig={{
                cssFilePath: cssPath ?? null,
                sjsFilePath: sjsPath ?? null,
              }}
              jsImport={jsPath ?? null}
              excludeKeys={[]}
              formSuccessMessage={null}
              endpoint={endpoint}
              redirectUrl={null}
              isAllowedToEdit={true}
              onSurveySuccess={() => {
                toast({
                  title: "Survey submitted successfully!",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
              }}
              onSurveyFailure={() => {
                toast({
                  title: "Survey submission failed.",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
              }}
            />
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default SurveyTestComponent;
