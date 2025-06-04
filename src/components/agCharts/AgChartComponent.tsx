import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { AgCharts } from "ag-charts-react";
import "ag-charts-enterprise";
import { LicenseManager } from "ag-grid-charts-enterprise";
import { NoDataOverlayPink } from "@/components/agGrids/DataGrid/DataGridComponentLight";
import PerygonCard from "../layout/PerygonCard";
import LockIcon from "@mui/icons-material/Lock";

LicenseManager.setLicenseKey(
  "Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-066268}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Sedulo_Limited}_is_granted_a_{Multiple_Applications}_Developer_License_for_{2}_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_{AG_Charts_and_AG_Grid}_Enterprise___This_key_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{30_September_2025}____[v3]_[0102]_MTc1OTE4NjgwMDAwMA==8e565c62a9475b11e35b2c3b1f037177"
);

const AgChartComponent = ({
  flex,
  title,
  chartOptions,
  noData,
  locked = false,
  lockedReason = "",
}: {
  flex: string;
  title: string;
  chartOptions: any;
  noData: boolean;
  locked?: boolean;
  lockedReason?: string;
}) => {
  return (
    <Box flex={flex} minWidth="300px">
      {/* Section Header */}
      <Flex width="100%" justifyContent="center" align="center" mb={4}>
        <SectionHeader>{title}</SectionHeader>
      </Flex>

      <PerygonCard height="500px">
        <Box position="relative" width="100%" height="100%">
          <Box
            width="100%"
            height="100%"
            style={{
              filter: locked ? "blur(24px)" : "none",
              transition: "filter 0.3s ease",
            }}
          >
            {noData ? (
              <NoDataOverlayPink />
            ) : (
              <AgCharts
                options={chartOptions as any}
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </Box>

          {locked && (
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              bg="rgba(255,255,255,0.6)"
              zIndex={2}
              p={4}
              textAlign="center"
              overflow="hidden"
            >
              <LockIcon fontSize="large" />
              <Text mt={2} fontSize="md" fontWeight="bold">
                {lockedReason}
              </Text>
            </Box>
          )}
        </Box>
      </PerygonCard>
    </Box>
  );
};

export default AgChartComponent;
