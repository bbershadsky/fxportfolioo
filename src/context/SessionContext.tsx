"use client";

import { createContext, useContext } from "react";

interface SessionContextProps {
  session: string;
  id: string;
  start: string;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const id = process.env.NEXT_PUBLIC_MFX_ACC_ID!;
  const session = process.env.NEXT_PUBLIC_MFX_SESSION!;
  const start = "2024-09-24"; // Update this for cleaner look
  // const start = "2024-12-19"; // Credit offset

  return (
    <SessionContext.Provider value={{ session, id, start }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
