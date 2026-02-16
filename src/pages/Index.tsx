import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import { QuizCard } from "@/components/QuizCard";
import { GameComplete } from "@/components/GameComplete";
import { SplashScreen } from "@/components/SplashScreen";
import { NameInput } from "@/components/NameInput";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Index = () => {
  const { data: questions, isLoading } = useQuestions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [playerAnswers, setPlayerAnswers] = useState<Record<string, string>>({});

  const shuffledQuestions = useMemo(() => {
    if (!questions) return [];
    return [...questions].sort(() => Math.random() - 0.5);
  }, [questions, gameKey]);

  const handleAnswer = (correct: boolean, questionId?: string, answerId?: string) => {
    if (correct) setScore((s) => s + 1);
    if (questionId && answerId) {
      setPlayerAnswers((prev) => ({ ...prev, [questionId]: answerId }));
    }
    setCurrentIndex((i) => i + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setPlayerAnswers({});
    setGameKey((k) => k + 1);
  };

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const currentQuestion = shuffledQuestions[currentIndex];
  const isGameComplete = shuffledQuestions.length > 0 && currentIndex >= shuffledQuestions.length;
  const progressPercent = shuffledQuestions.length > 0 ? Math.round((currentIndex / shuffledQuestions.length) * 100) : 0;

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

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
        ) : !playerName ? (
          <NameInput onSubmit={setPlayerName} />
        ) : shuffledQuestions.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-4">No hay preguntas disponibles</p>
            <Link to="/admin">
              <Button>Ir al admin para crear preguntas</Button>
            </Link>
          </div>
        ) : isGameComplete ? (
          <GameComplete
            score={score}
            total={shuffledQuestions.length}
            onRestart={handleRestart}
            questions={shuffledQuestions}
            playerName={playerName}
            playerAnswers={playerAnswers}
          />
        ) : (
          <>
            <div className="w-full max-w-lg mx-auto mb-6">
              <div className="relative">
                <Progress value={progressPercent} className="h-6" />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {progressPercent}%
                </span>
              </div>
            </div>
            <QuizCard key={currentQuestion.id} question={currentQuestion} onAnswer={handleAnswer} />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
