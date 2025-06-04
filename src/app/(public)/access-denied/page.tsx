import { Suspense } from "react";
import AccessDenied from "@/components/AccessDenied";

export const dynamic = "force-dynamic"; // disables prerendering

export default function AccessDeniedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccessDenied />
    </Suspense>
  );
}
