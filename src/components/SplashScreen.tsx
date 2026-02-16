import { useState, useEffect } from "react";

const FACE_EMOJIS = ["😀", "😎", "🤔", "😱", "🤩", "😈", "🥳", "😤", "🫣", "😏", "🤯", "😬", "🥸", "😵‍💫", "🤠"];
const GUN_EMOJI = "🔫";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [currentFace, setCurrentFace] = useState(FACE_EMOJIS[0]);
  const [phase, setPhase] = useState<"cycling" | "done">("cycling");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFace(FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)]);
    }, 150);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPhase("done");
      setTimeout(onComplete, 600);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex items-center gap-4">
        <span
          className="text-8xl transition-all duration-100"
          style={{ display: "inline-block", transform: phase === "done" ? "scale(1.2)" : "scale(1)" }}
        >
          {currentFace}
        </span>
        <span className="text-7xl animate-bounce-in">{GUN_EMOJI}</span>
      </div>
    </div>
  );
}
