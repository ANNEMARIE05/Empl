"use client";

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Bouton } from "@/components/ui/button";
import { Carte, CarteContenu, CarteEntete, CarteTitre } from "@/components/ui/card";
import { Pastille } from "@/components/ui/badge";
import { useMarquerNotificationLue, useNotifications } from "@/hooks/queries/use-notifications";

export function VueNotifications() {
  const { data = [], isLoading } = useNotifications();
  const marquer = useMarquerNotificationLue();

  return (
    <Carte>
      <CarteEntete>
        <CarteTitre>Centre de notifications</CarteTitre>
      </CarteEntete>
      <CarteContenu className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-[var(--texte-secondaire)]">Chargement…</p>
        ) : (
          data.map((n) => (
            <div
              key={n.id}
              className="flex flex-col gap-2 rounded-[var(--rayon-md)] border border-[var(--bordure)]/80 bg-[var(--surface-elevee)]/80 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{n.titre}</p>
                  {!n.lue ? <Pastille ton="danger">Nouveau</Pastille> : <Pastille ton="neutre">Lu</Pastille>}
                </div>
                <p className="mt-1 text-sm text-[var(--texte-secondaire)]">{n.message}</p>
                <p className="mt-2 text-[11px] text-[var(--texte-secondaire)]">
                  {formatDistanceToNow(new Date(n.creeLe), { addSuffix: true, locale: fr })}
                </p>
              </div>
              {!n.lue ? (
                <Bouton taille="sm" variante="secondaire" onClick={() => marquer.mutate(n.id)}>
                  Marquer comme lu
                </Bouton>
              ) : null}
            </div>
          ))
        )}
      </CarteContenu>
    </Carte>
  );
}
