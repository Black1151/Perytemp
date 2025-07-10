import { recognitionCategoryJson } from "@/components/surveyjs/forms/recognitionCategory";
import AdminHeader from "@/components/AdminHeader";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function RecognitionCategoriesCreatePage() {

  return (
    <>
      <AdminHeader headingText={"Create Recognition Category"} />
      <AdminFormWrapper
        formJson={recognitionCategoryJson}
        data={null}
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
        endpoint={"/bigup"}
        formSuccessMessage={"Category created successfully"}
        reloadPageOnSuccess={true}
        redirectUrl={"/bigup-categories"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
