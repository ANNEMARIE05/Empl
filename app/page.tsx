import { Suspense } from "react";
import { CoquilleApplication } from "@/components/coquille-application";
import { ChargeurPleinEcran } from "@/components/layout/chargeur-plein-ecran";

export default function Page() {
  return (
    <Suspense fallback={<ChargeurPleinEcran />}>
      <CoquilleApplication />
    </Suspense>
  );
}
