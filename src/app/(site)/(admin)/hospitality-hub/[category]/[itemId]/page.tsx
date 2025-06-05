import AdminHeader from "@/components/AdminHeader";
import { checkUserRole } from "@/lib/dal";
import CategoryForm from "../../components/CategoryForm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HospitalityItemPage({
  params,
}: {
  params: { category: string; itemId: string };
}) {
  await checkUserRole(`/hospitality-hub/${params.category}/${params.itemId}`);

  const baseUrl = process.env.NEXTAUTH_URL || "";
  const res = await fetch(
    `${baseUrl}/api/hospitality-hub/${params.category}/${params.itemId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return redirect("/error");
  }

  const json = await res.json();
  const item = json.resource;
  const title = `Edit ${item?.name || item?.provider || "Item"}`;

  return (
    <>
      <AdminHeader headingText={title} />
      <CategoryForm
        category={params.category}
        itemId={params.itemId}
        initialData={item}
      />
    </>
  );
}
