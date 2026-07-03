"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import {
  ActiveProfileProvider,
  useActiveProfile,
} from "@/components/auth/ActiveProfileContext";
import { db, type LocalUser } from "@/components/db";
import { AuthLockScreen } from "./AuthLockScreen";
import {
  Wind,
  MessageSquare,
  BarChart2,
  Grid,
  User,
  LogOut,
  BookOpen,
} from "lucide-react";

function ResponsiveAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activeUser, setActiveUser, loading } = useActiveProfile();
  const [allUsers, setAllUsers] = useState<LocalUser[]>([]);
  const [pendingUser, setPendingUser] = useState<LocalUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!activeUser?.id) return;
    try {
      await db.users.delete(activeUser.id);
      await db.history.where("userId").equals(activeUser.id).delete();
      setActiveUser(null);
      toast.success("Account deleted.");
      setIsDeleting(false);
    } catch {
      toast.error("Failed to delete account.");
    }
  };

  const refreshUsersList = () => {
    db.users.toArray().then(setAllUsers);
  };

  useEffect(() => {
    refreshUsersList();
  }, [activeUser]);

  const handleSelectUser = (userId: number) => {
    const target = allUsers.find((u) => u.id === userId);
    if (!target) return;

    // Set the user as pending so the AuthLockScreen opens
    setPendingUser(target);
    // Important: Do not set activeUser here, that happens in onUnlockSuccess
  };

  const navLinks = [
    { href: "/mindfulness", label: "Mindfulness", icon: Wind },
    { href: "/coach", label: "Emotional Coach", icon: MessageSquare },
    { href: "/progress", label: "Progress Tracker", icon: BarChart2 },
    { href: "/puzzles", label: "Focus Puzzles", icon: Grid },
    { href: "/journal", label: "Journal", icon: BookOpen },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs font-medium text-slate-400">
        Loading workspace databases...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 sm:pb-0">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex justify-between items-center gap-4">
          <Link
            href="/"
            className="text-lg font-bold text-teal-700 tracking-tight shrink-0"
          >
            Neuro-Resilience Gym
          </Link>

          {activeUser && (
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs font-medium flex items-center gap-2 transition-colors ${
                      isActive
                        ? "text-teal-700"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Desktop Links Panel */}
          {activeUser && (
            <div className="flex items-center gap-2">
              {isDeleting ? (
                <div className="flex gap-1">
                  <button
                    onClick={handleDeleteAccount}
                    className="text-[10px] bg-rose-600 text-white px-2 py-1 rounded"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setIsDeleting(false)}
                    className="text-[10px] bg-slate-200 px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsDeleting(true)}
                  className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => setActiveUser(null)}
                className="p-2 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-xl bg-white transition"
                title="Lock Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Identity Control Deck */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            {allUsers.length > 0 && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 max-w-[140px] sm:max-w-[180px]">
                <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <select
                  value={activeUser?.id ?? pendingUser?.id ?? ""}
                  onChange={(e) => handleSelectUser(Number(e.target.value))}
                  className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden pr-4 cursor-pointer truncate w-full"
                >
                  <option value="" disabled>
                    -- Account --
                  </option>
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} {activeUser?.id === u.id ? "✓" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {activeUser && (
              <button
                onClick={() => setActiveUser(null)}
                className="p-2 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-xl bg-white transition"
                title="Lock Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Viewport Content Port */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 relative">
        {activeUser ? (
          children
        ) : (
          <AuthLockScreen
            pendingUser={pendingUser}
            onUnlockSuccess={(user) => {
              setActiveUser(user);
              setPendingUser(null);
            }}
            onClearPending={() => setPendingUser(null)}
            onRefreshDropdown={refreshUsersList}
          />
        )}
      </main>

      {/* Mobile Bottom Tab Bar (Visible only on mobile/tablets when logged in) */}
      {activeUser && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1 z-40 flex justify-around items-center shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? "text-teal-600 font-bold bg-teal-50/50"
                    : "text-slate-500 active:bg-slate-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium tracking-tight">
                  {link.label.split(" ")[0]}{" "}
                  {/* Shortens to single words for fitting tight mobile grids */}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ClientShellWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ActiveProfileProvider>
      <ResponsiveAppShell>{children}</ResponsiveAppShell>
    </ActiveProfileProvider>
  );
}
