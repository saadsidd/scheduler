import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function(newMode, replace = false) {
    setMode(newMode);
    setHistory(prev => {
      if (replace) {
        prev.pop();
      }
      return [...prev, newMode]
    });
  }

  const back = function() {
    const newHistory = [...history];
    if (newHistory.length > 1) {
      newHistory.pop();
    }
    setMode(newHistory[newHistory.length-1]);
    setHistory(newHistory);
  }

  return { mode, transition, back };
}