"use client";

import { useState } from "react";
import { Brain } from "lucide-react";
import SolitaireGame from "@/components/games/SolitaireGame";
import FlowerSolitaire from "@/components/games/FlowerSolitaire";
import Sudoku from "@/components/games/Sudoku";
import WordSearch from "@/components/games/WordSearch";
import JigsawJamWorld from "@/components/games/JigsawJamWorld";
import Garden from "@/components/games/Garden";
import AnimalQuiz from "@/components/games/AnimalQuiz";

export default function PuzzlesPage() {
  const games = [
    { id: "sudoku", title: "Sudoku", component: <Sudoku /> },
    { id: "wordsearch", title: "Word Search", component: <WordSearch /> },
    {
      id: "jigsawjamworld",
      title: "Jigsaw Jam World",
      component: <JigsawJamWorld />,
    },
    {
      id: "garden",
      title: "Garden",
      component: <Garden />,
    },
    { id: "solitaire", title: "Solitaire", component: <SolitaireGame /> },
    {
      id: "flower-solitaire",
      title: "Flower Solitaire",
      component: <FlowerSolitaire />,
    },
    {
      id: "animal-quiz",
      title: "Animal Quiz",
      component: <AnimalQuiz />,
    },
  ];

  const [activeGameId, setActiveGameId] = useState(games[0].id);
  const activeGame = games.find((g) => g.id === activeGameId);

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans px-4">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Brain className="text-purple-600 w-7 h-7" /> Focus Puzzles
        </h1>

        <select
          value={activeGameId}
          onChange={(e) => setActiveGameId(e.target.value)}
          className="bg-slate-100 border border-slate-200 text-xs font-medium rounded-lg px-3 py-2 cursor-pointer"
        >
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4">
        {activeGame?.component}
      </div>
    </div>
  );
}
