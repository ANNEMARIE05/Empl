import { useEffect, useState } from "react";

export function useMediaRequete(requete: string) {
  const [correspond, setCorrespond] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(requete);
    const maj = () => setCorrespond(media.matches);
    maj();
    media.addEventListener("change", maj);
    return () => media.removeEventListener("change", maj);
  }, [requete]);

  return correspond;
}
