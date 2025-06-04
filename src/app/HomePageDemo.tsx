"use client";

import {
  Box,
  Flex,
  GridItem,
  SimpleGrid,
  Stack,
  useTheme,
  VStack,
} from "@chakra-ui/react";

import { StatBox } from "@/components/Masonry/StatsMasonry/StatBox";
import { SpringScale } from "@/components/animations/SpringScale";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LineGraph from "@/components/graphs/LineGraph";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  const onClickLogout = async () => {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/error");
    }
  };

  return (
    <VStack
      minH="100vh"
      width="100%"
      overflowX="hidden"
      flex={1}
      bgGradient={`linear(to-br, ${theme.colors.secondary}, ${theme.colors.primary})`}
    >
      {isLoading ? (
        // <SplashScreen />
        <div>saddappayaface</div>
      ) : (
        <>
          <Stack
            flexDirection={["column-reverse", null, null, "row"]}
            gap={5}
            width="100%"
            maxW={1200}
            p={6}
          >
            <VStack w="100%" flex={1}>
              <SpringScale delay={0.2}>
                <Box mb={2}>
                  <SectionHeader>Happiness by Individuals</SectionHeader>
                </Box>
              </SpringScale>
              <SimpleGrid gap={5} columns={[2]} flex={1} w="100%">
                <SpringScale delay={0}>
                  <StatBox
                    bgColor={"red"}
                    data="22"
                    title={"1-2"}
                    titleImage="/faces/happiness_score_2.png"
                  />
                </SpringScale>
                <SpringScale delay={0.5}>
                  <StatBox
                    bgColor={theme.colors.yellow}
                    data={"153"}
                    title={"3-5"}
                    titleImage="/faces/happiness_score_6.png"
                  />
                </SpringScale>
                <SpringScale delay={0.7}>
                  <StatBox
                    bgColor={theme.colors.lightGreen}
                    data={"6"}
                    title={"6-8"}
                    titleImage="/faces/happiness_score_8.png"
                  />
                </SpringScale>
                <SpringScale delay={1.2}>
                  <StatBox
                    bgColor={theme.colors.green}
                    data={"220"}
                    title={"9-10"}
                    titleImage="/faces/happiness_score_9.png"
                  />
                </SpringScale>
                <GridItem colSpan={2}>
                  <SpringScale delay={0.3}>
                    <StatBox
                      bgColor="lightGray"
                      data={"7"}
                      title={"Did not participate"}
                      counterColor={"lightGray"}
                    />
                  </SpringScale>
                </GridItem>
              </SimpleGrid>
            </VStack>
            <SpringScale delay={0.1} style={{ flex: 2 }}>
              <Flex mb={4} width="100%" justifyContent="center">
                <SectionHeader>Happiness by Group</SectionHeader>
              </Flex>
              {/* <BarGraph
                DataPoints={[
                  { value: 9, title: "Leeds" },
                  { value: 7, title: "Manchester" },
                  { value: 2, title: "Birmingham" },
                  { value: 7, title: "London" },
                  { value: 10, title: "Edinburgh" },
                  { value: 3, title: "Dublin" },
                ]}
              /> */}
              <LineGraph
                DataPoints={[
                  { value: 2, title: "Jan" },
                  { value: 7, title: "Feb" },
                  { value: 3, title: "Mar" },
                  { value: 8, title: "Apr" },
                  { value: 6, title: "May" },
                  { value: 10, title: "Jun" },
                ]}
              />
            </SpringScale>
          </Stack>
        </>
      )}
    </VStack>
  );
}
