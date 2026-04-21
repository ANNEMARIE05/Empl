import type { ChargeUtileJeton } from "@/lib/jeton-mock";

export function encoderJetonCoteServeur(payload: ChargeUtileJeton): string {
  const json = JSON.stringify(payload);
  return `mock.${Buffer.from(json, "utf8").toString("base64url")}`;
}

export function decoderJetonCoteServeur(
  enTeteAuthorization: string | null,
): ChargeUtileJeton | null {
  if (!enTeteAuthorization?.startsWith("Bearer mock.")) return null;
  const partie = enTeteAuthorization.slice("Bearer mock.".length);
  try {
    const json = Buffer.from(partie, "base64url").toString("utf8");
    return JSON.parse(json) as ChargeUtileJeton;
  } catch {
    return null;
  }
}
