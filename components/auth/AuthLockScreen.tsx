"use client";

import { useState } from "react";
import { db, type LocalUser } from "@/components/db";
import { ProfileGateForm } from "./ProfileGateForm";
import { ProfileCreationForm } from "./ProfileCreationForm";
import { ShieldAlert, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

interface AuthLockScreenProps {
  pendingUser: LocalUser | null;
  onUnlockSuccess: (unlockedUser: LocalUser) => void;
  onClearPending: () => void;
  onRefreshDropdown: () => void;
}

export function AuthLockScreen({
  pendingUser,
  onUnlockSuccess,
  onClearPending,
  onRefreshDropdown,
}: AuthLockScreenProps) {
  const [showRegistration, setShowRegistration] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const handleHardReset = async () => {
    try {
      await db.delete();
      toast.success("All data wiped. Reloading...");
      window.location.reload();
    } catch {
      toast.error("Failed to reset database.");
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-50/95 z-50 flex items-center justify-center p-4 pt-12 animate-fadeIn">
      {pendingUser && !showRegistration ? (
        <ProfileGateForm
          pendingUser={pendingUser}
          onUnlockSuccess={onUnlockSuccess}
          onCancel={onClearPending}
        />
      ) : showRegistration ? (
        <ProfileCreationForm
          onCreationSuccess={() => {
            setShowRegistration(false);
            onRefreshDropdown();
          }}
          onCancel={() => setShowRegistration(false)}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center max-w-sm w-full space-y-4 shadow-xs">
          <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800">
              Workspace Locked
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              No account is signed in. Pick your name from the menu or create a
              new account to begin.
            </p>
          </div>
          <button
            onClick={() => setShowRegistration(true)}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 min-h-[40px]"
          >
            <UserPlus className="w-3.5 h-3.5" /> Create New Account
          </button>

          {isConfirmingReset ? (
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100">
              <p className="text-[10px] text-rose-600 font-bold">
                Are you sure? Delete ALL data?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleHardReset}
                  className="flex-1 bg-rose-600 text-white text-[10px] py-1.5 rounded-lg"
                >
                  Yes, Wipe
                </button>
                <button
                  onClick={() => setIsConfirmingReset(false)}
                  className="flex-1 bg-slate-200 text-[10px] py-1.5 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsConfirmingReset(true)}
              className="text-[10px] text-slate-400 hover:text-rose-600 underline mt-2 block w-full"
            >
              Forgot password? Reset all device data.
            </button>
          )}
        </div>
      )}
    </div>
  );
}
