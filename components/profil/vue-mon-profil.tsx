"use client";

import { Carte, CarteContenu, CarteDescription, CarteEntete, CarteTitre } from "@/components/ui/card";
import { Pastille } from "@/components/ui/badge";
import { magasinApplication } from "@/stores/magasin-application";

export function VueMonProfil() {
  const utilisateur = magasinApplication((s) => s.utilisateurConnecte);
  if (!utilisateur) return null;

  const estRh = utilisateur.role === "rh";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Carte>
        <CarteEntete>
          <CarteTitre>Identité</CarteTitre>
          <CarteDescription>Informations visibles par l’organisation.</CarteDescription>
        </CarteEntete>
        <CarteContenu className="space-y-2 text-sm">
          <p>
            <span className="text-[var(--texte-secondaire)]">Nom :</span>{" "}
            <span className="font-medium">
              {utilisateur.prenom} {utilisateur.nom}
            </span>
          </p>
          <p>
            <span className="text-[var(--texte-secondaire)]">Email :</span> {utilisateur.email}
          </p>
          <p>
            <span className="text-[var(--texte-secondaire)]">Département :</span> {utilisateur.departement}
          </p>
          <p>
            <span className="text-[var(--texte-secondaire)]">Poste :</span> {utilisateur.poste}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-[var(--texte-secondaire)]">Rôle :</span>
            <Pastille ton={estRh ? "accent" : utilisateur.role === "manager" ? "alerte" : "neutre"}>
              {utilisateur.role.toUpperCase()}
            </Pastille>
          </p>
        </CarteContenu>
      </Carte>

      <Carte>
        <CarteEntete>
          <CarteTitre>{estRh ? "Champs RH étendus" : "Vue employé"}</CarteTitre>
          <CarteDescription>
            {estRh
              ? "Accès aux référentiels sensibles (mock) : matrices de compétences, budgets de masse salariale."
              : "Les champs sensibles (rémunération détaillée, entretiens managériaux) sont masqués dans cette démo."}
          </CarteDescription>
        </CarteEntete>
        <CarteContenu className="space-y-2 text-sm text-[var(--texte-secondaire)]">
          {estRh ? (
            <ul className="list-disc space-y-1 pl-5">
              <li>Accès complet aux workflows de validation.</li>
              <li>Visibilité sur les notes internes RH des dossiers.</li>
              <li>Paramétrage des types de congés et documents.</li>
            </ul>
          ) : (
            <ul className="list-disc space-y-1 pl-5">
              <li>Consultation des demandes personnelles uniquement.</li>
              <li>Pas d’édition des dossiers d’autres collaborateurs.</li>
              <li>Notifications limitées à votre périmètre.</li>
            </ul>
          )}
        </CarteContenu>
      </Carte>
    </div>
  );
}
