import { NextRequest, NextResponse } from "next/server";
import { extraireContexte } from "@/lib/api-serveur/extraire-jeton";
import { lireNotifications, marquerNotificationLue } from "@/lib/memoire-donnees";

export async function GET(req: NextRequest) {
  const ctx = extraireContexte(req);
  if (!ctx) return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  const liste = lireNotifications().filter((n) => n.destinataireId === ctx.idEmploye);
  return NextResponse.json(liste);
}

export async function PATCH(req: NextRequest) {
  const ctx = extraireContexte(req);
  if (!ctx) return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  try {
    const { id } = (await req.json()) as { id?: string };
    if (!id) return NextResponse.json({ message: "Identifiant manquant" }, { status: 400 });
    const notif = lireNotifications().find((n) => n.id === id);
    if (!notif || notif.destinataireId !== ctx.idEmploye) {
      return NextResponse.json({ message: "Introuvable" }, { status: 404 });
    }
    marquerNotificationLue(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Corps invalide" }, { status: 400 });
  }
}
