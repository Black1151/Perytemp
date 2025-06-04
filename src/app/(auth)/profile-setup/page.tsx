import { Center, VStack } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { LoginCard } from "@/components/login/LoginCard";
import { ProfileCompletionForm } from "@/components/forms/ProfileCompletionForm";
import { cookies } from "next/headers";
import { DropdownOption } from "@/components/forms/InputField";
import { transformTeams } from "../../api/selectItems/fetchTeamsSelectItems/transformTeams";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/dal";
import { NewCompanyUserProfileCompletionForm } from "@/components/forms/NewCompanyUserProfileCompletionForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const typesArray = ["job_level", "job_type", "title", "team", "dept"];

export default async function ProfileSetup() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const uniqueId = cookieStore.get("user_uuid")?.value;
  const user = await getUser();

  let dropdowns;
  let departments;
  let sites;
  let isProfileRegistered = false;

  try {
    const profileCheckFetch = await fetch(
      `${process.env.BE_URL}/user/isProfileComplete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ uniqueId }),
      },
    );
    const profileCheckResponse = await profileCheckFetch.json();
    isProfileRegistered = profileCheckResponse.resource.isProfileRegistered;
  } catch {
    redirect("/error");
  }

  if (isProfileRegistered) {
    redirect("/");
  }

  try {
    const fetchDropdowns = fetch(`${process.env.BE_URL}/selectItem/allBy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ type: typesArray }),
    });

    const fetchDepartments = fetch(
      `${process.env.BE_URL}/userTeam/allBy?selectColumns=id,name&parentTeamId=null`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    const fetchSites = fetch(
      `${process.env.BE_URL}/site/allBy?selectColumns=id,siteName`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    const [
      fetchDropdownsResponse,
      fetchDepartmentsResponse,
      fetchSitesResponse,
    ] = await Promise.all([fetchDropdowns, fetchDepartments, fetchSites]);
    const dropdownsData = await fetchDropdownsResponse.json();
    const departmentsData = await fetchDepartmentsResponse.json();
    const sitesData = await fetchSitesResponse.json();

    type SiteFromBE = {
      id: number;
      siteName: string;
    };

    const transformSites = (sites: SiteFromBE[]): DropdownOption[] => {
      return sites.map((site) => ({
        value: site.id,
        label: site.siteName,
      }));
    };

    dropdowns = dropdownsData.resource;
    departments = transformTeams(departmentsData.resource);
    sites = transformSites(sitesData.resource);
  } catch (error: any) {
    redirect("/error");
  }

  if (user.role === "CA" && user.customerId === null) {
    return (
      <PerygonContainer>
      <Center flex={1}>
        <LoginCard
          height={1125}
          imageOffset={-750}
          titleComponent={
            <VStack position="absolute" top="50px">
              <LetterFlyIn fontSize={90}>Perygon</LetterFlyIn>
              <LetterFlyIn fontSize={38}>Please set up</LetterFlyIn>
              <LetterFlyIn fontSize={38}>your profile</LetterFlyIn>
              <LetterFlyIn fontSize={22}>Then company setup...</LetterFlyIn>
            </VStack>
          }
        >
          <NewCompanyUserProfileCompletionForm
            isSubmitting={false}
            errors={{}}
            dropdowns={dropdowns}
          />
        </LoginCard>
      </Center>
    </PerygonContainer>
    )
  }

  return (
    <PerygonContainer>
      <Center flex={1}>
        <LoginCard
          height={1500}
          imageOffset={-1150}
          titleComponent={
            <VStack position="absolute" top="50px">
              <LetterFlyIn fontSize={90}>Perygon</LetterFlyIn>
              <LetterFlyIn fontSize={38}>Please set up</LetterFlyIn>
              <LetterFlyIn fontSize={38}>your profile</LetterFlyIn>
              <LetterFlyIn fontSize={22}>Then you are all done!</LetterFlyIn>
            </VStack>
          }
        >
          <ProfileCompletionForm
            isSubmitting={false}
            errors={{}}
            dropdowns={dropdowns}
            departmentsDropdown={departments || []}
            sitesDropdown={sites || []}
          />
        </LoginCard>
      </Center>
    </PerygonContainer>
  );
}
