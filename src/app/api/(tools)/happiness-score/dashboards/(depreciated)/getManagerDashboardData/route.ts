import {NextResponse} from "next/server";
import apiClient from "@/lib/apiClient";
import {cookies} from "next/headers";
import {FilterOptionGroup} from "@/app/api/(tools)/happiness-score/dashboards/company-happiness/types";
import {getUser} from "@/lib/dal";

interface ApiResponse {
    resource: ApiResponseItem[];
}

interface Tag {
    tagId: number;
    name: string;
}

interface ApiResponseItem {
    role: string;
    email: string;
    firstName: string;
    lastName: string;
    userId: number;
    fullName: string;
    employStartDate: string;
    userImageUrl: string;
    userIsActive: boolean;
    userUniqueId: string;
    customerId: number;
    customerName: string;
    companyNo: string;
    customerCode: string;
    customerType: string;
    customerParentName: string | null;
    customerParentId: number | null;
    companySizeId: number;
    companySizeName: string;
    customerIsActive: boolean;
    businessTypeName: string;
    businessTypeId: number;
    siteName: string;
    siteId: number;
    teamName: string;
    teamId: number;
    jobLevelName: string;
    jobLevelId: number;
    deptName: string;
    deptId: number;
    regionName: string;
    regionId: number;
    sectorName: string;
    sectorId: number;
    contractTypeName: string;
    contractTypeId: number;
    multiSite: boolean;
    noOfSites: number;
    noOfUsers: number;
    numberOfEmployees: number;
    webAddress: string;
    remoteWorker: boolean;
    jsonBpRespFull: string;
    jsonBpRespLite: string;
    createdAt: string;
    createdBy: number;
    toolConfigId: number;
    workflowId: number;
    businessProcessId: number;
    workflowInstanceId: number;
    businessProcessInstanceId: number;
    userTags?: Tag[];
    siteTags?: Tag[];
    customerTags?: Tag[];
    jobTitle: string;
}

interface DataPoint {
    value: number;
    title: string;
}

interface SpeechBubbleData {
    currentScore: number;
    change: number;
    positiveChange: boolean;
}

interface Person {
    userId: number;
    imageUrl: string;
    fullName: string;
    firstName: string;
    lastName: string;
    jobTitle: string;
    department: string;
    site: string;
    score: number | null;
}

function camelCaseToWords(str: string): string {
    return str
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/^./, (char) => char.toUpperCase());
}

const getWeekNumber = (date: Date): [number, number] => {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    const weekNo = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
    return [target.getFullYear(), weekNo];
};

interface WeekData {
    weekKey: string;
    startDate: Date;
    endDate: Date;
}

function getAllWeekKeysBetween(startDate: Date, endDate: Date): WeekData[] {
    const weeks: WeekData[] = [];
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    // Align to Monday
    currentDate.setDate(currentDate.getDate() - ((currentDate.getDay() + 6) % 7));

    while (currentDate <= endDate) {
        const [year, weekNo] = getWeekNumber(currentDate);
        const weekKey = `${year}-W${weekNo}`;

        // End of this week is Sunday (Monday + 6 days)
        const weekStart = new Date(currentDate);
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + 6); // Sunday

        weeks.push({
            weekKey: weekKey,
            startDate: weekStart,
            endDate: weekEnd,
        });

        currentDate.setDate(currentDate.getDate() + 7);
    }
    return weeks;
}

interface DidNotParticipateParams {
    workflowId: number;
    businessProcessId: number;
    toolConfigId: number;
    startDate: string;
    endDate: string;
}

async function getDidNotParticipate({
                                        workflowId,
                                        businessProcessId,
                                        toolConfigId,
                                        startDate,
                                        endDate,
                                    }: DidNotParticipateParams) {

    const user = await getUser();

    const response = await apiClient("/getUserHappinessParticipants", {
        method: "POST",
        body: JSON.stringify({
            scheduleId: 14,
            customerId: user.customerId,
            toolConfigId,
            workflowId,
            businessProcessId,
            startDate,
            endDate,
        }),
    });

    return response.json();
}

export async function GET(request: Request) {
    const cookieStore = cookies();
    const apiToken = cookieStore.get("auth_token")?.value;
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    const preFilter = queryParams.preFilter;

    let managerOfDeptIds: string[] = [];
    let managerOfTeamIds: string[] = [];

    if (preFilter === "departments" || preFilter === "teams") {
        try {
            const uniqueId = cookieStore.get("user_uuid")?.value;
            if (!uniqueId) {
                return NextResponse.json(
                    {error: "User unique ID not found in cookies."},
                    {status: 400}
                );
            }

            const response = await apiClient("/getTeamsUserIsManagerOf", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
                body: JSON.stringify({userUniqueId: uniqueId}),
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch manager of departments and teams: ${response.statusText}`
                );
            }

            const data = await response.json();
            const deptIds = data.resource.managerOfDeptIds || [];
            const teamIds = data.resource.managerOfTeamIds || [];

            managerOfDeptIds = deptIds.map(String);
            managerOfTeamIds = teamIds.map(String);
        } catch (error) {
            console.error("Error fetching manager of departments and teams:", error);
            return NextResponse.json(
                {error: "Failed to fetch manager of departments and teams."},
                {status: 500}
            );
        }

        if (preFilter === "departments") {
            if (managerOfDeptIds.length === 0) {
                return NextResponse.json(
                    {error: "User does not manage any departments."},
                    {status: 403}
                );
            }
        } else if (preFilter === "teams") {
            if (managerOfTeamIds.length === 0) {
                return NextResponse.json(
                    {error: "User does not manage any teams."},
                    {status: 403}
                );
            }
        }
    }

    const timeRange = queryParams.timeRange || "all";

    const selectedFilters = {
        siteId: queryParams.siteId?.split(",") || [],
        jobLevelId: queryParams.jobLevelId?.split(",") || [],
        deptId: queryParams.deptId?.split(",") || [],
        teamId: queryParams.teamId?.split(",") || [],
        contractTypeId: queryParams.contractTypeId?.split(",") || [],
        role: queryParams.role?.split(",") || [],
        remoteWorker: queryParams.remoteWorker === "true" ? ["true"] : [],
        userTagId: queryParams.userTagId?.split(",") || [],
        siteTagId: queryParams.siteTagId?.split(",") || [],
        customerTagId: queryParams.customerTagId?.split(",") || [],
    };

    const workflowId = queryParams.workflowId || 1;
    const businessProcessId = queryParams.businessProcessId || 1;
    const toolConfigId = queryParams.toolConfigId || 1;

    const filterGroups = [
        {key: "deptName", paramName: "deptId"},
        {key: "teamName", paramName: "teamId"},
        {key: "role", paramName: "role"},
        {key: "jobLevelName", paramName: "jobLevelId"},
        {key: "contractTypeName", paramName: "contractTypeId"},
        {key: "remoteWorker", paramName: "remoteWorker"},
        {key: "siteName", paramName: "siteId"},
        {key: "userTags", paramName: "userTagId"},
        {key: "siteTags", paramName: "siteTagId"},
        {key: "customerTags", paramName: "customerTagId"},
    ];

    const keyToIdMapping: Record<string, string> = {
        deptName: "deptId",
        teamName: "teamId",
        jobLevelName: "jobLevelId",
        contractTypeName: "contractTypeId",
        siteName: "siteId",
        userTags: "tagId",
        siteTags: "tagId",
        customerTags: "tagId",
    };

    function buildEndpoint(
        filters: any,
        managerOfDeptIds: string[],
        managerOfTeamIds: string[],
        preFilter: string | undefined
    ) {
        let endpoint = `/getAllView?view=vwDashboardDataFromReportJson&toolConfigId=${toolConfigId}&workflowId=${workflowId}&businessProcessId=${businessProcessId}`;

        if (preFilter === "departments") {
            if (managerOfDeptIds.length > 0) {
                if (filters.deptId && filters.deptId.length > 0) {
                    filters.deptId = filters.deptId.filter((id: string) =>
                        managerOfDeptIds.includes(id)
                    );
                    if (filters.deptId.length === 0) {
                        return "";
                    }
                } else {
                    filters.deptId = managerOfDeptIds;
                }
            } else {
                return "";
            }
        } else if (preFilter === "teams") {
            if (managerOfTeamIds.length > 0) {
                if (filters.teamId && filters.teamId.length > 0) {
                    filters.teamId = filters.teamId.filter((id: string) =>
                        managerOfTeamIds.includes(id)
                    );
                    if (filters.teamId.length === 0) {
                        return "";
                    }
                } else {
                    filters.teamId = managerOfTeamIds;
                }
            } else {
                return "";
            }
        }

        Object.keys(filters).forEach((key) => {
            if (filters[key]?.length) {
                endpoint += `&${key}=${filters[key].join(",")}`;
            }
        });

        return endpoint;
    }

    function getStartDateFromTimeRange(timeRange: string): Date | null {
        const now = new Date();
        switch (timeRange) {
            case "1 month":
                return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            case "3 months":
                return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
            case "6 months":
                return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
            case "1 year":
                return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            case "all":
            default:
                return null;
        }
    }

    const startDate = getStartDateFromTimeRange(timeRange);

    const filterGroupPromises = filterGroups.map(async (group) => {
        const filtersExcludingCurrentGroup = {...selectedFilters} as Record<
            string,
            string[]
        >;
        delete filtersExcludingCurrentGroup[group.paramName];

        const endpoint = buildEndpoint(
            filtersExcludingCurrentGroup,
            managerOfDeptIds,
            managerOfTeamIds,
            preFilter
        );

        if (!endpoint) {
            return null;
        }

        try {
            const response = await apiClient(endpoint, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch data for ${group.key}`);
            }

            const dataForGroup: ApiResponse = await response.json();
            const optionsSet = new Map<string, { label: string; value: string }>();

            for (const item of dataForGroup.resource) {
                let dataField = item[group.key as keyof ApiResponseItem];

                if (
                    group.key === "userTags" ||
                    group.key === "siteTags" ||
                    group.key === "customerTags"
                ) {
                    if (typeof dataField === "string") {
                        try {
                            dataField = JSON.parse(dataField);
                        } catch (error) {
                            console.error(`Error parsing ${group.key} for item`, item, error);
                            dataField = [];
                        }
                    }

                    if (Array.isArray(dataField)) {
                        for (const tag of dataField) {
                            if (tag && tag.tagId && tag.name) {
                                optionsSet.set(String(tag.tagId), {
                                    label: tag.name,
                                    value: String(tag.tagId),
                                });
                            }
                        }
                    }
                } else {
                    const label = dataField;
                    const idKey = keyToIdMapping[group.key];
                    const value = idKey ? item[idKey as keyof ApiResponseItem] : label;
                    if (label && label !== "null") {
                        optionsSet.set(String(value), {
                            label: String(label),
                            value: String(value),
                        });
                    }
                }
            }

            const options = Array.from(optionsSet.values());
            options.sort((a, b) => a.label.localeCompare(b.label));

            const groupLabels: Record<string, string> = {
                userTags: "User Tags",
                siteTags: "Site Tags",
                customerTags: "Customer Tags",
            };

            return {
                label: groupLabels[group.key] || camelCaseToWords(group.key),
                options: options,
            };
        } catch (error) {
            console.error("Error fetching data for group:", group.key, error);
            return null;
        }
    });

    const filterGroupResults = await Promise.all(filterGroupPromises);

    const availableOptions = filterGroupResults.filter(
        (result) => result !== null
    ) as FilterOptionGroup[];

    const endpointWithAllFilters = buildEndpoint(
        selectedFilters,
        managerOfDeptIds,
        managerOfTeamIds,
        preFilter
    );

    if (!endpointWithAllFilters) {
        return NextResponse.json(
            {error: "No data available based on your filters."},
            {status: 403}
        );
    }

    let finalData: ApiResponse = {resource: []};

    try {
        const response = await apiClient(endpointWithAllFilters, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${apiToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch final data");
        }

        finalData = await response.json();
    } catch (error) {
        console.error("Error fetching final data:", error);
        return NextResponse.json(
            {error: "Failed to fetch data from the API."},
            {status: 500}
        );
    }

    const weekGroups = new Map<
        string,
        { score: number; item: ApiResponseItem }[]
    >();

    let earliestDate: Date | null = startDate || null;

    for (const item of finalData.resource) {
        const respFull = JSON.parse(item.jsonBpRespFull);
        const happinessScore = parseFloat(respFull.happinessScore);

        const createdAt = new Date(item.createdAt);

        if (startDate && createdAt < startDate) {
            continue;
        }
        if (!earliestDate || createdAt < earliestDate) {
            earliestDate = createdAt;
        }

        const [year, weekNo] = getWeekNumber(createdAt);
        const weekKey = `${year}-W${weekNo}`;

        if (!weekGroups.has(weekKey)) {
            weekGroups.set(weekKey, []);
        }
        weekGroups.get(weekKey)?.push({score: happinessScore, item});
    }

    if (!earliestDate) {
        earliestDate = startDate || new Date();
    }

    const currentDate = new Date();

    const allWeekData = getAllWeekKeysBetween(earliestDate, currentDate);

    const dataPointsArray: DataPoint[] = [];
    const weeksData: any[] = [];

    function formatDate(d: Date) {
        return d.toISOString().split("T")[0];
    }

    for (const {
        weekKey,
        startDate: weekStart,
        endDate: weekEnd,
    } of allWeekData) {
        const entries = weekGroups.get(weekKey) || [];

        let avgScore = 0;
        const masonryCounts = [0, 0, 0, 0, 0];
        const peopleList: Person[] = [];

        const departmentScores = new Map<
            string,
            { totalScore: number; count: number }
        >();
        const siteScores = new Map<
            number,
            {
                totalScore: number;
                count: number;
                mostRecentSiteName: string;
                mostRecentCreatedAt: Date;
            }
        >();

        if (entries.length > 0) {
            const totalScore = entries.reduce((sum, entry) => sum + entry.score, 0);
            avgScore = totalScore / entries.length;

            entries.forEach(({score, item}) => {
                // Classify scores
                if (score >= 9)
                    masonryCounts[3]++; // 9-10
                else if (score >= 6)
                    masonryCounts[2]++; // 6-8
                else if (score >= 3)
                    masonryCounts[1]++; // 3-5
                else if (score > 0) masonryCounts[0]++; // 1-2
                // Note: We'll handle masonryCounts[4] (non-participants) after fetching them

                peopleList.push({
                    userId: item.userId,
                    imageUrl: item.userImageUrl,
                    fullName: item.fullName,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    jobTitle: item.jobTitle,
                    department: item.deptName,
                    site: item.siteName,
                    score: score,
                });

                const deptName = item.deptName;
                if (deptName) {
                    if (!departmentScores.has(deptName)) {
                        departmentScores.set(deptName, {totalScore: 0, count: 0});
                    }
                    const deptData = departmentScores.get(deptName)!;
                    deptData.totalScore += score;
                    deptData.count += 1;
                }

                const siteId = item.siteId;
                if (siteId) {
                    if (!siteScores.has(siteId)) {
                        siteScores.set(siteId, {
                            totalScore: 0,
                            count: 0,
                            mostRecentSiteName: item.siteName,
                            mostRecentCreatedAt: new Date(item.createdAt),
                        });
                    }
                    const siteData = siteScores.get(siteId)!;
                    siteData.totalScore += score;
                    siteData.count += 1;
                    const itemCreatedAt = new Date(item.createdAt);
                    if (itemCreatedAt > siteData.mostRecentCreatedAt) {
                        siteData.mostRecentCreatedAt = itemCreatedAt;
                        siteData.mostRecentSiteName = item.siteName;
                    }
                }
            });
        }

        // Fetch non-participants for this week
        const didNotParticipateData = await getDidNotParticipate({
            workflowId: Number(workflowId),
            businessProcessId: Number(businessProcessId),
            toolConfigId: Number(toolConfigId),
            startDate: formatDate(weekStart),
            endDate: formatDate(weekEnd),
        });

        const filteredNonParticipantData =
            didNotParticipateData?.resource?.filter((item: any) => {
                if (preFilter === "departments") {
                    return managerOfDeptIds.includes(String(item.departmentId));
                }
                if (preFilter === "teams") {
                    return managerOfTeamIds.includes(String(item.teamId));
                }
                return true; // If no preFilter or it doesn't match, include all items
            }) || [];

        masonryCounts[4] = filteredNonParticipantData.length || 0;

        // Map non-participants to Person format
        let nonParticipants = filteredNonParticipantData.map((np: any) => ({
            userId: np.UserId,
            imageUrl: np.imageUrl,
            fullName: np.fullName,
            firstName: np.fullName.split(" ")[0] || "",
            lastName: np.fullName.split(" ").slice(1).join(" ") || "",
            jobTitle: np.jobTitle,
            department: np.deptName,
            site: np.siteName,
            score: null, // no score for non-participants
        }));

        // Merge non-participants into peopleList
        peopleList.push(...nonParticipants);

        const departmentsData: {
            department: string;
            averageScore: number;
            count: number;
        }[] = [];
        departmentScores.forEach((value, key) => {
            departmentsData.push({
                department: key,
                averageScore: value.totalScore / value.count,
                count: value.count,
            });
        });

        const sitesData: {
            site: string;
            averageScore: number;
            count: number;
        }[] = [];
        siteScores.forEach((value, key) => {
            sitesData.push({
                site: value.mostRecentSiteName,
                averageScore: value.totalScore / value.count,
                count: value.count,
            });
        });

        dataPointsArray.push({
            title: weekKey,
            value: avgScore,
        });

        weeksData.push({
            weekKey,
            avgScore,
            masonryCounts,
            peopleList,
            departmentsData,
            sitesData,
        });
    }

    let speechBubbleData: SpeechBubbleData = {
        currentScore: 0,
        change: 0,
        positiveChange: true,
    };
    if (dataPointsArray.length >= 2) {
        const currentWeekAverage = dataPointsArray[dataPointsArray.length - 1];
        const previousWeekAverage = dataPointsArray[dataPointsArray.length - 2];
        const change = currentWeekAverage.value - previousWeekAverage.value;
        speechBubbleData = {
            currentScore: currentWeekAverage.value,
            change: Math.abs(change),
            positiveChange: change >= 0,
        };
    } else if (dataPointsArray.length === 1) {
        speechBubbleData = {
            currentScore: dataPointsArray[0].value,
            change: 0,
            positiveChange: true,
        };
    }

    return NextResponse.json({
        filterOptions: availableOptions,
        lineGraphData: dataPointsArray,
        speechBubbleData,
        weeksData,
        data: finalData.resource,
    });
}
