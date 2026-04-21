"use client";

import { useTheme } from "next-themes";
import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { Bouton } from "@/components/ui/button";

export function VueParametres() {
  const { theme, setTheme } = useTheme();

  return (
    <Carte>
      <CarteEntete>
        <CarteTitre>Préférences</CarteTitre>
        <CarteDescription>Thème clair / sombre piloté par next-themes.</CarteDescription>
      </CarteEntete>
      <CarteContenu className="flex flex-wrap gap-2">
        <Bouton variante={theme === "light" ? "defaut" : "secondaire"} onClick={() => setTheme("light")}>
          Clair
        </Bouton>
        <Bouton variante={theme === "dark" ? "defaut" : "secondaire"} onClick={() => setTheme("dark")}>
          Sombre
        </Bouton>
        <Bouton variante={theme === "system" ? "defaut" : "secondaire"} onClick={() => setTheme("system")}>
          Système
        </Bouton>
      </CarteContenu>
    </Carte>
  );
}
