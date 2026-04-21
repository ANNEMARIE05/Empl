"use client";

import * as React from "react";
import { useEffect } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent } from "framer-motion";

export function NombreAnime({
  valeur,
  suffixe = "",
  decimales = 0,
}: {
  valeur: number;
  suffixe?: string;
  decimales?: number;
}) {
  const compteur = useMotionValue(valeur);
  const [affiche, setAffiche] = React.useState(valeur);

  useEffect(() => {
    const controls = animate(compteur, valeur, {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [valeur, compteur]);

  useMotionValueEvent(compteur, "change", (v) => {
    setAffiche(decimales ? Number(v.toFixed(decimales)) : v);
  });

  return (
    <motion.span className="reveal-compteur tabular-nums" layout>
      {decimales ? affiche.toFixed(decimales) : Math.round(affiche)}
      {suffixe}
    </motion.span>
  );
}
