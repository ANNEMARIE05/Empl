import { NextRequest, NextResponse } from "next/server";
import { extraireContexte } from "@/lib/api-serveur/extraire-jeton";
import {
  ajouterDemandeConge,
  lireConges,
  lireEmployes,
  mettreAJourConge,
  trouverEmployeParId,
} from "@/lib/memoire-donnees";
import type { DemandeConge, StatutDemandeConge, TypeConge } from "@/types";

function filtrerConges(ctx: NonNullable<ReturnType<typeof extraireContexte>>) {
  const toutes = lireConges();
  if (ctx.role === "rh") return toutes;
  if (ctx.role === "employe") {
    return toutes.filter((c) => c.employeId === ctx.idEmploye);
  }
  const manager = trouverEmployeParId(ctx.idEmploye);
  if (!manager) return [];
  const idsMemeDept = new Set(
    lireEmployes()
      .filter((e) => e.departement === manager.departement)
      .map((e) => e.id),
  );
  return toutes.filter((c) => idsMemeDept.has(c.employeId));
}

export async function GET(req: NextRequest) {
  const ctx = extraireContexte(req);
  if (!ctx) return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  return NextResponse.json(filtrerConges(ctx));
}

export async function PATCH(req: NextRequest) {
  const ctx = extraireContexte(req);
  if (!ctx) return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  if (ctx.role !== "rh") {
    return NextResponse.json({ message: "Interdit" }, { status: 403 });
  }
  try {
    const body = (await req.json()) as {
      id?: string;
      commentaireRh?: string;
      statut?: StatutDemandeConge;
    };
    if (!body.id) {
      return NextResponse.json({ message: "Identifiant manquant" }, { status: 400 });
    }
    const maj = mettreAJourConge(body.id, {
      commentaireRh: body.commentaireRh,
      statut: body.statut,
    });
    if (!maj) return NextResponse.json({ message: "Introuvable" }, { status: 404 });
    return NextResponse.json(maj);
  } catch {
    return NextResponse.json({ message: "Corps invalide" }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const ctx = extraireContexte(req);
  if (!ctx) return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  if (ctx.role === "rh") {
    return NextResponse.json(
      { message: "Les comptes RH ne créent pas de congés personnels via ce flux (démo)." },
      { status: 403 },
    );
  }
  try {
    const body = (await req.json()) as {
      type?: TypeConge;
      dateDebut?: string;
      dateFin?: string;
      motif?: string;
    };
    if (!body.type || !body.dateDebut || !body.dateFin) {
      return NextResponse.json({ message: "Champs requis manquants" }, { status: 400 });
    }
    const nouvelle: DemandeConge = {
      id: `c_${Date.now()}`,
      employeId: ctx.idEmploye,
      type: body.type,
      dateDebut: body.dateDebut,
      dateFin: body.dateFin,
      statut: "en_attente",
      motif: body.motif,
      commentaireRh: "",
      creeLe: new Date().toISOString(),
    };
    ajouterDemandeConge(nouvelle);
    return NextResponse.json(nouvelle, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Corps invalide" }, { status: 400 });
  }
}
