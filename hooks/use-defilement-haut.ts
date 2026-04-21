import { useEffect } from "react";

export function useDefilementHaut(dependance: unknown) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [dependance]);
}
