import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import { FormDetailsBanner } from "@/components/AdminDetailsBanners/FormDetailsBanner";
import { formsJson } from "@/components/surveyjs/forms/forms";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function FormsDetailPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/forms/${params.uniqueId}`);

  const res = await apiClient(`/form/findBy?id=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const form = await res.json();
  const formData = form.resource;

  return (
    <>
      <FormDetailsBanner form={formData} />
      <AdminFormWrapper
        formJson={formsJson}
        data={formData}
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
        endpoint={`/form/${params.uniqueId}`}
        formSuccessMessage={null}
        reloadPageOnSuccess={true}
        redirectUrl={null}
        isNew={false}
        isAllowedToEdit={true}
      />
    </>
  );
}
