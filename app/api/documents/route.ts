import { NextRequest, NextResponse } from "next/server";
import { extraireContexte } from "@/lib/api-serveur/extraire-jeton";
import {
  ajouterDemandeDocument,
  lireDocuments,
  lireEmployes,
  mettreAJourDocument,
  trouverEmployeParId,
} from "@/lib/memoire-donnees";
import type { DemandeDocument, StatutDemandeDocument, TypeDocument } from "@/types";

function filtrerDocuments(ctx: NonNullable<ReturnType<typeof extraireContexte>>) {
  const toutes = lireDocuments();
  if (ctx.role === "rh") return toutes;
  if (ctx.role === "employe") {
    return toutes.filter((d) => d.employeId === ctx.idEmploye);
  }
  const manager = trouverEmployeParId(ctx.idEmploye);
  if (!manager) return [];
  const ids = new Set(
    lireEmployes()
      .filter((e) => e.departement === manager.departement)
      .map((e) => e.id),
  );
  return toutes.filter((d) => ids.has(d.employeId));
}

export async function GET(req: NextRequest) {
  const ctx = extraireContexte(req);
  if (!ctx) return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  return NextResponse.json(filtrerDocuments(ctx));
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
      statut?: StatutDemandeDocument;
    };
    if (!body.id) {
      return NextResponse.json({ message: "Identifiant manquant" }, { status: 400 });
    }
    const maj = mettreAJourDocument(body.id, {
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
      { message: "Les comptes RH utilisent le flux administrateur (démo)." },
      { status: 403 },
    );
  }
  try {
    const body = (await req.json()) as {
      type?: TypeDocument;
      commentaireEmploye?: string;
    };
    if (!body.type) {
      return NextResponse.json({ message: "Type requis" }, { status: 400 });
    }
    const nouvelle: DemandeDocument = {
      id: `d_${Date.now()}`,
      employeId: ctx.idEmploye,
      type: body.type,
      statut: "en_attente",
      commentaireEmploye: body.commentaireEmploye,
      creeLe: new Date().toISOString(),
    };
    ajouterDemandeDocument(nouvelle);
    return NextResponse.json(nouvelle, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Corps invalide" }, { status: 400 });
  }
}
