"use client";

import { useSearchParams } from "next/navigation";
import AccessDeniedBox from "@/components/layout/AccessDeniedBox";

export default function AccessDenied() {
  const searchParams = useSearchParams();
  const deniedPath = searchParams.get("path") || "";
  const userParam = searchParams.get("user") || "";
  let userAccessControlMetadata = null;

  try {
    userAccessControlMetadata = userParam;
  } catch {
    userAccessControlMetadata = null;
  }

  return (
    <AccessDeniedBox
      buttonText="Go Home"
      buttonLink="/"
      supportingText="You do not have access to this page."
      deniedPath={deniedPath}
      userAccessControlMetadata={userAccessControlMetadata}
    />
  );
}
