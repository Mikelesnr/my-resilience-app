// Example: components/AppHeader.tsx
import { Dumbbell } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex items-center gap-2 p-4">
      <Dumbbell className="w-8 h-8 text-teal-600" />
      <link rel="manifest" href="/manifest.json" />
      <span className="font-bold text-slate-800">Mind Gym</span>
    </header>
  );
}
