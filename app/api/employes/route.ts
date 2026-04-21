import { NextRequest, NextResponse } from "next/server";
import { extraireContexte } from "@/lib/api-serveur/extraire-jeton";
import { lireEmployes, trouverEmployeParId } from "@/lib/memoire-donnees";

export async function GET(req: NextRequest) {
  const ctx = extraireContexte(req);
  if (!ctx) return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
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
