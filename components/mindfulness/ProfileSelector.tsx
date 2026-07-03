"use client";

import { Users } from "lucide-react";
import { type LocalUser, db } from "@/components/db";
import toast from "react-hot-toast";

interface ProfileSelectorProps {
  allUsers: LocalUser[];
  onSelectUser: (user: LocalUser) => void;
  onRefreshUsers: () => void;
}

export function ProfileSelector({
  allUsers,
  onSelectUser,
  onRefreshUsers,
}: ProfileSelectorProps) {
  // The actual deletion logic
  const executeDelete = async (userId: number, userName: string) => {
    try {
      await db.history.where("userId").equals(userId).delete();
      await db.users.delete(userId);
      toast.success(`Profile "${userName}" removed completely.`, {
        id: `del-${userId}`,
      });
      onRefreshUsers();
    } catch {
      toast.error("Failed to delete local user records.", {
        id: `del-${userId}`,
      });
    }
  };

  // Trigger high-contrast contextual confirmation toast
  const handleDeleteClick = (e: React.MouseEvent, user: LocalUser) => {
    e.stopPropagation();
    if (!user.id) return;

    const toastId = `del-${user.id}`;

    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-1">
          <div className="text-xs text-slate-800 font-medium">
            Permanently wipe profile{" "}
            <span className="font-bold text-slate-900">"{user.name}"</span> and
            all session logs?
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition min-h-[32px]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                executeDelete(user.id!, user.name);
              }}
              className="px-2.5 py-1.5 text-[11px] font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-md transition shadow-xs min-h-[32px]"
            >
              Wipe Data
            </button>
          </div>
        </div>
      ),
      {
        id: toastId,
        duration: 8000, // Gives ample window to tap action items comfortably
        position: "top-center",
        style: {
          border: "1px solid #e2e8f0",
          padding: "12px",
          color: "#0f172a",
          background: "#ffffff",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
          borderRadius: "12px",
          maxWidth: "320px",
        },
      },
    );
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
      <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
        <Users className="w-4 h-4 text-teal-600" /> Choose Your Profile to Begin
      </h2>
      {allUsers.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-6">
          No active user profiles found on this hardware device.
        </p>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
          {allUsers.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between border border-slate-200 rounded-lg hover:border-teal-600 transition bg-slate-50/50 min-h-[48px]"
            >
              <button
                onClick={() => onSelectUser(u)}
                className="flex-1 p-3.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition rounded-l-lg truncate"
              >
                {u.name}
              </button>
              <button
                onClick={(e) => handleDeleteClick(e, u)}
                className="p-3.5 text-slate-400 hover:text-rose-600 transition rounded-r-lg flex items-center justify-center min-w-[44px] min-h-[44px]"
                title={`Delete ${u.name}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
