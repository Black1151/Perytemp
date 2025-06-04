import React from "react";
import RegisterSuccess from "./Success";
import { registerCustomerJson } from "@/components/surveyjs/forms/registerCompany";
import { getUser } from "@/lib/dal";
import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function RegisterCompanyPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  const user = await getUser();
  if (!user) redirect("/login");

  let apiRes: { response?: any } = {};
  if (user.customerUniqueId) {
    try {
      const response = await apiClient(
        `/customer/findBy?uniqueId=${user.customerUniqueId}`
      );
      apiRes.response = await response.json();
    } catch (err) {
      console.error("Failed to fetch customer data:", err);
    }
  }

  return (
    <RegisterSuccess
      initialCustomerData={apiRes.response}
    />
  );
}
