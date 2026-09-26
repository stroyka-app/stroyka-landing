"use client";

import { createContext, useContext, useState } from "react";

/**
 * The crew size a visitor dialled in on SeatMath, carried down to pricing.
 * `null` until they actually touch the slider — pricing only personalises
 * for a number the visitor chose, never for the slider's default.
 */
type Crew = { crew: number | null; setCrew: (n: number) => void };

const CrewCtx = createContext<Crew>({ crew: null, setCrew: () => {} });

export function CrewProvider({ children }: { children: React.ReactNode }) {
  const [crew, setCrew] = useState<number | null>(null);
  return <CrewCtx.Provider value={{ crew, setCrew }}>{children}</CrewCtx.Provider>;
}

export const useCrew = () => useContext(CrewCtx);
