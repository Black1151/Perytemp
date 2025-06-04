import React from "react";
import Link from "next/link";
import { Box, Flex } from "@chakra-ui/react";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { AgGauge } from "ag-charts-react";
import "ag-charts-enterprise";
import { LicenseManager } from "ag-grid-charts-enterprise";
import { NoDataOverlayPink } from "@/components/agGrids/DataGrid/DataGridComponentLight";
import PerygonCard from "../layout/PerygonCard";

LicenseManager.setLicenseKey(
  "Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-066268}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Sedulo_Limited}_is_granted_a_{Multiple_Applications}_Developer_License_for_{2}_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_{AG_Charts_and_AG_Grid}_Enterprise___This_key_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{30_September_2025}____[v3]_[0102]_MTc1OTE4NjgwMDAwMA==8e565c62a9475b11e35b2c3b1f037177"
);

interface AgChartComponentProps {
  flex: string;
  title?: string;
  chartOptions: any;
  noData: boolean;
  height?: string;
  href?: string;
}

const AgChartComponent = ({
  flex,
  title,
  chartOptions,
  noData,
  height = "500px",
  href,
}: AgChartComponentProps) => {
  const content = (
    <Box flex={flex} minWidth="300px" height={"100%"}>
      {title && (
        <Flex width="100%" justifyContent="center" align="center" mb={4}>
          <SectionHeader>{title}</SectionHeader>
        </Flex>
      )}

      <PerygonCard height={height}>
        {noData ? (
          <NoDataOverlayPink />
        ) : (
          <AgGauge
            options={chartOptions}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </PerygonCard>
    </Box>
  );

  return href ? (
    <Link href={href} passHref legacyBehavior>
      <a style={{ display: "block", height: "100%", cursor:"pointer"}}>{content}</a>
    </Link>
  ) : (
    content
  );
};

export default AgChartComponent;
