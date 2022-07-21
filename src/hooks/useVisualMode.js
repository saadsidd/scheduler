import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // Adds a new mode to the history array, but if replace is true then it removes last element before adding
  const transition = function(newMode, replace = false) {
    setMode(newMode);
    setHistory(prev => {
      const newHistory = [...prev];
      if (replace) {
        newHistory.pop();
      }
      return [...newHistory, newMode]
    });
  }

  // Removes last element in history array, then sets mode
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