"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { Heart, Brain, BarChart2, Bell, Grid, BookOpen } from "lucide-react";

export default function Home() {
  const enableReminders = () => {
    toast.success("Daily wellness reminders scheduled successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome to Your Mind Gym
          </h1>
          <p className="text-teal-100 max-w-xl text-sm">
            Track your wellness and practice active stress reduction techniques.
          </p>
        </div>
        <button
          onClick={enableReminders}
          className="w-full md:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
        >
          <Bell className="w-4 h-4" /> Enable Reminders
        </button>
      </div>

      {/* Improved Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            href: "/mindfulness",
            icon: Heart,
            title: "Mindfulness",
            color: "teal",
            desc: "Structured breathing guide to calm the nervous system.",
          },
          {
            href: "/coach",
            icon: Brain,
            title: "Emotional Coach",
            color: "purple",
            desc: "Cognitive frameworks to reframe stressful thoughts.",
          },
          {
            href: "/progress",
            icon: BarChart2,
            title: "Progress Tracker",
            color: "amber",
            desc: "Analyze long-term wellness data trends.",
          },
          {
            href: "/puzzles",
            icon: Grid,
            title: "Focus Puzzles",
            color: "indigo",
            desc: "Cognitive focus exercises to sharpen clarity.",
          },
          {
            href: "/journal",
            icon: BookOpen,
            title: "Appreciation Journal",
            color: "teal",
            desc: "Reflect on positive moments and daily gratitude.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.href}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div className="mb-4">
                <div
                  className={`w-10 h-10 bg-${item.color}-50 rounded-lg flex items-center justify-center text-${item.color}-600 mb-3`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">
                  {item.title}
                </h2>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <Link
                href={item.href}
                className={`block text-center bg-${item.color}-600 text-white py-2 rounded-lg font-medium hover:bg-${item.color}-700 transition text-xs`}
              >
                {item.href === "/puzzles"
                  ? "Play Games"
                  : item.href === "/progress"
                    ? "View Analytics"
                    : item.title === "Mindfulness"
                      ? "Start Exercise"
                      : item.title === "Appreciation Journal"
                        ? "Open Journal"
                        : "Open Coach"}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
