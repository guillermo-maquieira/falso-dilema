import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import { QuizCard } from "@/components/QuizCard";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { GameComplete } from "@/components/GameComplete";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Index = () => {
  const { data: questions, isLoading } = useQuestions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  const shuffledQuestions = useMemo(() => {
    if (!questions) return [];
    return [...questions].sort(() => Math.random() - 0.5);
  }, [questions, gameKey]);

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    setCurrentIndex((i) => i + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setGameKey((k) => k + 1);
  };

  const currentQuestion = shuffledQuestions[currentIndex];
  const isGameComplete = shuffledQuestions.length > 0 && currentIndex >= shuffledQuestions.length;

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      <header className="flex items-center justify-end mb-8 max-w-lg mx-auto w-full">
        <Link to="/admin">
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        {isLoading ? (
          <p className="text-muted-foreground">Cargando...</p>
        ) : shuffledQuestions.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-4">No hay preguntas disponibles</p>
            <Link to="/admin">
              <Button>Ir al admin para crear preguntas</Button>
            </Link>
          </div>
        ) : isGameComplete ? (
          <GameComplete score={score} total={shuffledQuestions.length} onRestart={handleRestart} />
        ) : (
          <>
            <ScoreDisplay score={score} total={shuffledQuestions.length} current={currentIndex + 1} />
            <QuizCard key={currentQuestion.id} question={currentQuestion} onAnswer={handleAnswer} />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
