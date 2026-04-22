"use client";

import { cn } from "@/lib/utils";
import { urlPhotoProfil } from "@/lib/url-photo-profil";
import type { RoleUtilisateur } from "@/types";

const tailles = {
  sm: "size-8",
  md: "size-10",
} as const;

const largeursPx = { sm: 32, md: 40 } as const;

export function ImageProfilUtilisateur({
  photoUrl,
  role,
  prenom,
  nom,
  taille = "md",
  className,
}: {
  photoUrl: string | undefined;
  role: RoleUtilisateur;
  prenom: string;
  nom: string;
  taille?: keyof typeof tailles;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden rounded-[var(--rayon-sm)]",
        tailles[taille],
        className,
      )}
    >
      <img
        src={urlPhotoProfil(photoUrl, role)}
        alt={`Photo de ${prenom} ${nom}`}
        className="h-full w-full object-cover object-top"
        width={largeursPx[taille]}
        height={largeursPx[taille]}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
