import { NextRequest, NextResponse } from "next/server";
import { extraireContexte } from "@/lib/api-serveur/extraire-jeton";
import {
  lireEmployes,
  trouverEmployeParId,
  ajouterEmploye,
  mettreAJourEmploye,
  supprimerEmploye,
} from "@/lib/memoire-donnees";
import type { Employe } from "@/types";

export async function GET(req: NextRequest) {
  const ctx = extraireContexte(req);
  if (!ctx) return NextResponse.json({ message: "Non authentifie" }, { status: 401 });
  if (ctx.role === "employe") {
    return NextResponse.json({ message: "Interdit" }, { status: 403 });
  }
  const tous = lireEmployes();
  if (ctx.role === "rh") {
    return NextResponse.json(tous);
  }
  const manager = trouverEmployeParId(ctx.idEmploye);
  if (!manager) return NextResponse.json([]);
  return NextResponse.json(
    tous.filter((e) => e.departement === manager.departement),
  );
}

export async function POST(req: NextRequest) {
  const ctx = extraireContexte(req);
  if (!ctx) return NextResponse.json({ message: "Non authentifie" }, { status: 401 });
  if (ctx.role !== "rh") {
    return NextResponse.json({ message: "Seul les RH peuvent creer des employes" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const nouvelEmploye: Employe = {
      id: `e${Date.now()}`,
      prenom: body.prenom,
      nom: body.nom,
      email: body.email,
      role: body.role || "employe",
      departement: body.departement,
      poste: body.poste,
      dateEmbauche: body.dateEmbauche || new Date().toISOString().split("T")[0],
      photoUrl: body.photoUrl,
    };
    const cree = ajouterEmploye(nouvelEmploye);
    return NextResponse.json(cree, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Donnees invalides" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const ctx = extraireContexte(req);
  if (!ctx) return NextResponse.json({ message: "Non authentifie" }, { status: 401 });
  if (ctx.role !== "rh") {
    return NextResponse.json({ message: "Seul les RH peuvent modifier des employes" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, ...patch } = body;
    if (!id) {
      return NextResponse.json({ message: "ID requis" }, { status: 400 });
    }
    const maj = mettreAJourEmploye(id, patch);
    if (!maj) {
      return NextResponse.json({ message: "Employe non trouve" }, { status: 404 });
    }
    return NextResponse.json(maj);
  } catch {
    return NextResponse.json({ message: "Donnees invalides" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const ctx = extraireContexte(req);
  if (!ctx) return NextResponse.json({ message: "Non authentifie" }, { status: 401 });
  if (ctx.role !== "rh") {
    return NextResponse.json({ message: "Seul les RH peuvent supprimer des employes" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "ID requis" }, { status: 400 });
    }
    const supprime = supprimerEmploye(id);
    if (!supprime) {
      return NextResponse.json({ message: "Employe non trouve" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Erreur lors de la suppression" }, { status: 500 });
  }
}
