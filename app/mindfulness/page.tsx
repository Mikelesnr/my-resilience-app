"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { db, type LocalUser } from "@/components/db";
import { useActiveProfile } from "@/components/auth/ActiveProfileContext";
import {
  ShieldAlert,
  Play,
  Wind,
  Pause,
  Square,
  Clock,
  LogOut,
} from "lucide-react";

// Import Skeletons directly for instantaneous initial render
import {
  ProfileSelectorSkeleton,
  RegistrationFormSkeleton,
} from "@/components/mindfulness/MindfulnessSkeletons";

// Dynamically stream the functional sub-components with fallback skeletons
const ProfileSelector = dynamic(
  () =>
    import("@/components/mindfulness/ProfileSelector").then(
      (mod) => mod.ProfileSelector,
    ),
  { ssr: false, loading: () => <ProfileSelectorSkeleton /> },
);

const RegistrationForm = dynamic(
  () =>
    import("@/components/mindfulness/RegistrationForm").then(
      (mod) => mod.RegistrationForm,
    ),
  { ssr: false, loading: () => <RegistrationFormSkeleton /> },
);

export default function MindfulnessPage() {
  // Authentication State via Global Context
  const { activeUser, setActiveUser } = useActiveProfile();
  const [allUsers, setAllUsers] = useState<LocalUser[]>([]);
  const [newUserName, setNewUserName] = useState<string>("");

  // Exercise State
  const [stressBefore, setStressBefore] = useState<number>(5);
  const [stressAfter, setStressAfter] = useState<number>(5);
  const [exerciseStep, setExerciseStep] = useState<
    "inhale" | "hold1" | "exhale" | "hold2"
  >("inhale");
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [targetCycles, setTargetCycles] = useState<number>(4);

  const loadUsers = async () => {
    const list = await db.users.toArray();
    setAllUsers(list);
  };

  const resetExercise = () => {
    setIsBreathingActive(false);
    setIsCompleted(false);
    setCyclesCompleted(0);
    setSecondsLeft(4);
    setExerciseStep("inhale");
  };

  const handleSelectUser = (user: LocalUser) => {
    setActiveUser(user);
    resetExercise();
  };

  useEffect(() => {
    let isMounted = true;
    loadUsers().then(() => {
      if (isMounted) {
        // State updates from loadUsers will be applied here
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    try {
      const existing = await db.users
        .where("name")
        .equalsIgnoreCase(newUserName.trim())
        .first();
      if (existing) {
        toast.error("This profile name already exists on this device.");
        return;
      }

      const id = await db.users.add({
        name: newUserName.trim(),
        createdAt: new Date().toLocaleDateString(),
      });

      const newUser = {
        id,
        name: newUserName.trim(),
        createdAt: new Date().toLocaleDateString(),
      };
      handleSelectUser(newUser);
      loadUsers();
      setNewUserName("");
      toast.success(`Profile created for ${newUser.name}!`);
    } catch {
      toast.error("Error creating local user profile.");
    }
  };

  const handleLogout = () => {
    setActiveUser(null);
    resetExercise();
  };

  // Pacing Timer Loop
  useEffect(() => {
    if (!isBreathingActive) return;

    const timer = setTimeout(() => {
      if (secondsLeft > 0) {
        setSecondsLeft((prev) => prev - 1);
        return;
      }

      setExerciseStep((prevStep) => {
        if (prevStep === "inhale") return "hold1";
        if (prevStep === "hold1") return "exhale";
        if (prevStep === "exhale") return "hold2";

        if (prevStep === "hold2") {
          const nextCount = cyclesCompleted + 1;
          setCyclesCompleted(nextCount);

          if (nextCount >= targetCycles) {
            setIsBreathingActive(false);
            setIsCompleted(true);
            return "inhale";
          }
          return "inhale";
        }
        return prevStep;
      });

      setSecondsLeft(4);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isBreathingActive, secondsLeft, cyclesCompleted, targetCycles]);

  const saveSession = async () => {
    if (!activeUser?.id) return;
    try {
      await db.history.add({
        userId: activeUser.id,
        date: new Date().toLocaleDateString(),
        stressBefore,
        stressAfter,
        notes: `Completed standard deep box-breathing workflow session (${targetCycles} full cycles).`,
      });
      toast.success("Session saved securely to your personal dashboard!");
      setIsCompleted(false);
      setCyclesCompleted(0);
      setStressBefore(5);
    } catch {
      toast.error("Error committing database transaction.");
    }
  };

  return (
    <div className="space-y-5 max-w-xl mx-auto font-sans px-2 sm:px-0">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wind className="text-teal-600 shrink-0" /> Mindfulness Hub
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Practice timed relaxation breathing cycles to clear mental
            stressors.
          </p>
        </div>
        {activeUser && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-100 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium transition w-full sm:w-auto justify-center min-h-[40px]"
          >
            <LogOut className="w-3.5 h-3.5" /> Leave Profile
          </button>
        )}
      </div>

      {/* GATEWAY: Local Multi-User Switchboard */}
      {!activeUser ? (
        <div className="space-y-4">
          <ProfileSelector
            allUsers={allUsers}
            onSelectUser={handleSelectUser}
            onRefreshUsers={loadUsers}
          />
          <RegistrationForm
            newUserName={newUserName}
            setNewUserName={setNewUserName}
            onSubmit={handleCreateUser}
          />
        </div>
      ) : (
        /* CORE WORKFLOWS */
        <>
          <div className="bg-teal-50 border border-teal-200 text-teal-800 rounded-lg px-4 py-2.5 text-xs font-medium text-center sm:text-left">
            Active Profile: <span className="font-bold">{activeUser.name}</span>
          </div>

          {/* 1. Initial State: Setup Panel */}
          {!isBreathingActive && !isCompleted && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-teal-600" /> Pre-Exercise
                  Mental Strain Check
                </h2>
                <div className="py-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stressBefore}
                    onChange={(e) => setStressBefore(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none accent-teal-600 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>1 (Calm)</span>
                  <span className="font-bold text-teal-700 text-xs">
                    Value: {stressBefore}
                  </span>
                  <span>10 (Severe Strain)</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> Target
                  Session Duration
                </label>
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                  {[2, 4, 8].map((cycles) => {
                    const totalSeconds = cycles * 16;
                    const displayTime =
                      totalSeconds < 60
                        ? `${totalSeconds}s`
                        : `${Math.round((totalSeconds / 60) * 10) / 10} min`;
                    return (
                      <button
                        key={cycles}
                        type="button"
                        onClick={() => setTargetCycles(cycles)}
                        className={`py-3 sm:py-2 rounded-lg text-xs font-medium border transition text-center flex flex-col justify-center items-center min-h-[44px] ${
                          targetCycles === cycles
                            ? "bg-teal-50 border-teal-600 text-teal-700 font-bold"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-xs">{cycles} Cycles</span>
                        <span className="text-[10px] opacity-75 font-normal mt-0.5">
                          ~{displayTime}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => {
                  setIsBreathingActive(true);
                  setExerciseStep("inhale");
                  setSecondsLeft(4);
                }}
                className="w-full bg-teal-600 text-white py-3.5 rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center justify-center gap-2 transition min-h-[48px]"
              >
                <Play className="w-4 h-4" /> Start Breathing Session (
                {targetCycles} Cycles)
              </button>
            </div>
          )}

          {/* 2. Running State */}
          {(isBreathingActive ||
            (!isBreathingActive && cyclesCompleted > 0 && !isCompleted)) && (
            <div className="bg-white p-5 sm:p-8 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-6">
              <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Cycle {Math.min(cyclesCompleted + 1, targetCycles)} of{" "}
                {targetCycles}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-800 capitalize tracking-tight h-7">
                {isBreathingActive ? (
                  <>
                    {exerciseStep === "inhale" && "Inhale deeply..."}
                    {exerciseStep === "hold1" && "Hold your breath..."}
                    {exerciseStep === "exhale" && "Exhale slowly..."}
                    {exerciseStep === "hold2" && "Rest and pause..."}
                  </>
                ) : (
                  "Session Paused"
                )}
              </h3>

              <p className="text-4xl sm:text-5xl font-black text-slate-700">
                {secondsLeft}s
              </p>

              <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full bg-teal-100 transition-all duration-1000 ${isBreathingActive && exerciseStep === "inhale" ? "scale-110 opacity-70" : isBreathingActive && exerciseStep === "exhale" ? "scale-50 opacity-20" : "scale-90 opacity-40"}`}
                />
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-teal-600 text-white flex flex-col items-center justify-center font-bold text-xs shadow-md z-10">
                  <span>
                    {exerciseStep === "hold1" || exerciseStep === "hold2"
                      ? "HOLD"
                      : exerciseStep.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-8 w-full pt-2">
                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className="flex items-center gap-2 text-sm sm:text-xs font-semibold text-slate-700 hover:text-teal-600 transition min-h-[44px] px-3"
                >
                  {isBreathingActive ? (
                    <>
                      <Pause className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> Resume
                    </>
                  )}
                </button>
                <button
                  onClick={resetExercise}
                  className="flex items-center gap-2 text-sm sm:text-xs font-semibold text-rose-600 hover:text-rose-700 transition min-h-[44px] px-3"
                >
                  <Square className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> Stop
                </button>
              </div>
            </div>
          )}

          {/* 3. Complete State */}
          {isCompleted && !isBreathingActive && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Post-Exercise Valuation Check
              </h2>
              <div className="py-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stressAfter}
                  onChange={(e) => setStressAfter(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none accent-teal-600 cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>1 (Calm)</span>
                <span className="font-bold text-teal-700 text-xs">
                  Value: {stressAfter}
                </span>
                <span>10 (Severe Strain)</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={resetExercise}
                  className="border border-slate-200 text-slate-700 py-3 sm:py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition order-2 sm:order-1 sm:flex-1 min-h-[44px]"
                >
                  Restart
                </button>
                <button
                  onClick={saveSession}
                  className="bg-slate-800 text-white py-3 sm:py-2.5 rounded-lg text-sm font-medium hover:bg-slate-900 transition order-1 sm:order-2 sm:flex-2 min-h-[44px]"
                >
                  Save Metrics
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
