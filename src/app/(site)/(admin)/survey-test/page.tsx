import AdminHeader from "@/components/AdminHeader";
import SurveyTestComponent from "@/components/surveyjs/SurveyTestComponent";
import fs from "fs";
import path from "path";
import { checkUserRole } from "@/lib/dal";

export default async function TestSurveyPage() {
  await checkUserRole("/survey-test");
  // Directories for CSS, SJS, and JS files
  const cssDirectory = path.join(process.cwd(), "public", "cssPath");
  const sjsDirectory = path.join(process.cwd(), "src", "theme", "sjsPath");
  const jsDirectory = path.join(
    process.cwd(),
    "src",
    "components",
    "surveyjs",
    "jsPath",
  );

  // Remove extensions from filenames
  const cssFiles = fs
    .readdirSync(cssDirectory)
    .map((file) => path.parse(file).name);
  const sjsFiles = fs
    .readdirSync(sjsDirectory)
    .map((file) => path.parse(file).name);
  const jsFiles = fs
    .readdirSync(jsDirectory)
    .map((file) => path.parse(file).name);

  return (
    <>
      <AdminHeader headingText={"Test Survey"} />
      <SurveyTestComponent
        cssFiles={cssFiles}
        sjsFiles={sjsFiles}
        jsFiles={jsFiles}
      />
    </>
  );
}
