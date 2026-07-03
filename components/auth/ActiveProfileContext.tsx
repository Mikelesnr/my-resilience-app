"use client";

import { createContext, useContext, useState } from "react";
import { type LocalUser } from "@/components/db";

interface ActiveProfileContextType {
  activeUser: LocalUser | null;
  setActiveUser: (user: LocalUser | null) => void;
  loading: boolean;
}

const ActiveProfileContext = createContext<
  ActiveProfileContextType | undefined
>(undefined);

export function ActiveProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Synchronously initialize state using a clean functional initializer
  const [activeUser, setActiveUserState] = useState<LocalUser | null>(() => {
    if (typeof window === "undefined") return null;

    const saved = localStorage.getItem("mindfulness_active_user");
    if (saved) {
      try {
        return JSON.parse(saved) as LocalUser;
      } catch {
        localStorage.removeItem("mindfulness_active_user");
        return null;
      }
    }
    return null;
  });

  // Since state is initialized on creation, we can drop the loading state down to false immediately
  const [loading] = useState(false);

  const setActiveUser = (user: LocalUser | null) => {
    setActiveUserState(user);
    if (user) {
      localStorage.setItem("mindfulness_active_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("mindfulness_active_user");
    }
  };

  return (
    <ActiveProfileContext.Provider
      value={{ activeUser, setActiveUser, loading }}
    >
      {children}
    </ActiveProfileContext.Provider>
  );
}

export function useActiveProfile() {
  const context = useContext(ActiveProfileContext);
  if (!context) {
    throw new Error(
      "useActiveProfile must be used within an ActiveProfileProvider",
    );
  }
  return context;
}
