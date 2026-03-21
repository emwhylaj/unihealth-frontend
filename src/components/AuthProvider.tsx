"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initFromStorage = useAuthStore((s) => s.initFromStorage);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    initFromStorage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
