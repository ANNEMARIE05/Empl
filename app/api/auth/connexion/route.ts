import { NextResponse } from "next/server";
import { employesMock } from "@/lib/donnees-mock";
import { encoderJetonCoteServeur } from "@/lib/jeton-mock-serveur";
import type { Employe } from "@/types";

function resoudreEmployeConnexion(emailBrut: string): Employe | null {
  const email = emailBrut.trim().toLowerCase();
  if (email.includes("rh") || email.includes("admin") || email.includes("marie")) {
    return employesMock.find((e) => e.id === "e1") ?? null;
  }
  if (email.includes("manager") || email.includes("lea")) {
    return employesMock.find((e) => e.id === "e3") ?? null;
  }
  return employesMock.find((e) => e.id === "e2") ?? null;
}

export async function POST(req: Request) {
  try {
    const { email, motDePasse } = (await req.json()) as {
      email?: string;
      motDePasse?: string;
    };
    if (!email || motDePasse !== "demo123") {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 },
      );
    }
    const employe = resoudreEmployeConnexion(email);
    if (!employe) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 },
      );
    }
    const jeton = encoderJetonCoteServeur({
      idEmploye: employe.id,
      role: employe.role,
    });
    return NextResponse.json({ employe, jeton });
  } catch {
    return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
  }
}
