import { redirect } from "next/navigation";
import { siteJson } from "@/components/surveyjs/forms/site";
import { SiteDetailsBanner } from "@/components/AdminDetailsBanners/SiteDetailsBanner";

import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";
import { checkUserRoleAccess } from "@/components/surveyjs/lib/utils";

export default async function SitesDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  const user = await getUser();
  
  await checkUserRole(`/sites/${params.uniqueId}`);

  const res = await apiClient(`/site/findBy?uniqueId=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const site = await res.json();
  const siteData = site.resource;

  return (
    <div>
      <SiteDetailsBanner site={siteData} />
      <AdminFormWrapper
        formJson={siteJson}
        data={siteData}
        layoutConfig={{
          layoutKey: "default",
          layoutProps: {},
        }}
        globalVariables={[]}
        stylingConfig={{
          sjsFilePath: "admin",
          cssFilePath: "admin",
        }}
        jsImport={""}
        excludeKeys={[]}
        endpoint={`/site/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={checkUserRoleAccess(user.role, ["PA", "CA"])}
      />
    </div>
  );
}
