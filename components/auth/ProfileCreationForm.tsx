"use client";

import { useState } from "react";
import { db } from "@/components/db";
import { hashPassword } from "@/components/auth/crypto";
import { UserPlus, CheckCircle, X } from "lucide-react";
import toast from "react-hot-toast";

interface ProfileCreationFormProps {
  onCreationSuccess: () => void;
  onCancel: () => void;
}

export function ProfileCreationForm({
  onCreationSuccess,
  onCancel,
}: ProfileCreationFormProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password) return;

    setIsSaving(true);
    try {
      // 1. Enforce unique usernames client-side
      const existing = await db.users
        .where("name")
        .equalsIgnoreCase(name.trim())
        .first();

      if (existing) {
        toast.error("Profile username already exists on this machine.");
        setIsSaving(false);
        return;
      }

      // 2. Compute cryptographically secure salt and hash key variables
      const { hash, salt } = await hashPassword(password);

      // 3. Commit row to local IndexedDB storage
      await db.users.add({
        name: name.trim(),
        passwordHash: hash,
        salt: salt,
        createdAt: new Date().toISOString(),
      });

      toast.success(`Profile for @${name} setup completely.`);
      onCreationSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Error creating local account profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleRegisterSubmit}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md w-full max-w-sm space-y-4 relative"
    >
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="text-center space-y-1">
        <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-2 text-teal-600">
          <UserPlus className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">
          Create Local Profile
        </h3>
        <p className="text-slate-500 text-xs">
          Set up secure credentials stored directly on your hardware.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Profile Account Name
          </label>
          <input
            type="text"
            required
            disabled={isSaving}
            placeholder="e.g., Michael"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 min-h-[40px]"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Security Master Password
          </label>
          <input
            type="password"
            required
            disabled={isSaving}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Fixed to call setPassword directly
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 min-h-[40px]"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition min-h-[44px]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 bg-teal-600 text-white hover:bg-teal-700 rounded-xl text-xs font-semibold transition min-h-[44px] flex items-center justify-center gap-1 shadow-xs"
        >
          {isSaving ? (
            "Saving..."
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5" /> Initialize
            </>
          )}
        </button>
      </div>
    </form>
  );
}
