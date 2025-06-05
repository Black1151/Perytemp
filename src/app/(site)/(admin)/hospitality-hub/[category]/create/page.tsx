import AdminHeader from "@/components/AdminHeader";
import { checkUserRole } from "@/lib/dal";
import CategoryForm from "../../components/CategoryForm";

export default async function HospitalityCreatePage({ params }: { params: { category: string } }) {
  await checkUserRole(`/hospitality-hub/${params.category}/create`);
  const title = `Create ${params.category.charAt(0).toUpperCase() + params.category.slice(1)}`;
  return (
    <>
      <AdminHeader headingText={title} />
      <CategoryForm category={params.category} />
    </>
  );
}
