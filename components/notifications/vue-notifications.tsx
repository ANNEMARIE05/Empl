"use client";

import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Bell, BellOff } from "lucide-react";
import { Bouton } from "@/components/ui/button";
import { Carte, CarteContenu, CarteEntete, CarteTitre, CarteDescription } from "@/components/ui/card";
import { Pastille } from "@/components/ui/badge";
import { FiltreSelect } from "@/components/ui/filtre-select";
import { BarreRecherche } from "@/components/ui/barre-recherche";
import { useMarquerNotificationLue, useNotifications } from "@/hooks/queries/use-notifications";

const optionsStatut = [
  { valeur: "non_lu", libelle: "Non lues" },
  { valeur: "lu", libelle: "Lues" },
];

export function VueNotifications() {
  const { data = [], isLoading } = useNotifications();
  const marquer = useMarquerNotificationLue();

  const [filtreStatut, setFiltreStatut] = useState("");
  const [recherche, setRecherche] = useState("");

  const donneesFiltrees = useMemo(() => {
    return data.filter((n) => {
      const correspondStatut =
        !filtreStatut ||
        (filtreStatut === "non_lu" && !n.lue) ||
        (filtreStatut === "lu" && n.lue);
      const correspondRecherche =
        !recherche ||
        n.titre.toLowerCase().includes(recherche.toLowerCase()) ||
        n.message.toLowerCase().includes(recherche.toLowerCase());
      return correspondStatut && correspondRecherche;
    });
  }, [data, filtreStatut, recherche]);

  const nombreNonLues = data.filter((n) => !n.lue).length;

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-principal)]/15">
          <Bell className="size-6 text-[var(--accent-principal)]" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Centre de notifications</h2>
          <p className="text-sm text-[var(--texte-secondaire)]">
            {nombreNonLues > 0
              ? `${nombreNonLues} notification${nombreNonLues > 1 ? "s" : ""} non lue${nombreNonLues > 1 ? "s" : ""}`
              : "Toutes les notifications sont lues"}
          </p>
        </div>
      </div>

      <Carte>
        <CarteEntete>
          <CarteTitre>Vos notifications</CarteTitre>
          <CarteDescription>
            Restez informe des derniers evenements et mises a jour.
          </CarteDescription>
        </CarteEntete>
        <CarteContenu className="space-y-4">
          {/* Barre de filtres */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <BarreRecherche
              valeur={recherche}
              onChangerValeur={setRecherche}
              placeholder="Rechercher dans les notifications..."
              className="w-full sm:max-w-xs"
            />
            <FiltreSelect
              valeur={filtreStatut}
              onChangerValeur={setFiltreStatut}
              options={optionsStatut}
              placeholder="Toutes les notifications"
              label="Filtrer par statut"
              className="w-full sm:w-52"
            />
          </div>

          {/* Liste des notifications */}
          {isLoading ? (
            <p className="text-sm text-[var(--texte-secondaire)]">Chargement...</p>
          ) : donneesFiltrees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BellOff className="size-12 text-[var(--texte-secondaire)]/40 mb-3" />
              <p className="text-sm text-[var(--texte-secondaire)]">Aucune notification trouvee.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {donneesFiltrees.map((n) => (
                <div
                  key={n.id}
                  className={`flex flex-col gap-2 rounded-[var(--rayon-md)] border p-4 sm:flex-row sm:items-center sm:justify-between transition-all ${
                    n.lue
                      ? "border-[var(--bordure)]/60 bg-[var(--surface-elevee)]/60"
                      : "border-[var(--accent-principal)]/30 bg-[var(--accent-principal)]/5"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{n.titre}</p>
                      {!n.lue ? (
                        <Pastille ton="danger">Nouveau</Pastille>
                      ) : (
                        <Pastille ton="neutre">Lu</Pastille>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-[var(--texte-secondaire)]">{n.message}</p>
                    <p className="mt-2 text-[11px] text-[var(--texte-secondaire)]">
                      {formatDistanceToNow(new Date(n.creeLe), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                  {!n.lue && (
                    <Bouton
                      taille="sm"
                      variante="secondaire"
                      onClick={() => marquer.mutate(n.id)}
                      disabled={marquer.isPending}
                    >
                      Marquer comme lu
                    </Bouton>
                  )}
                </div>
              ))}
            </div>
          )}
        </CarteContenu>
      </Carte>
    </div>
  );
}
