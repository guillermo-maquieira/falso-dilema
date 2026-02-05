import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Question } from "@/hooks/useQuestions";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
}

export function QuizCard({ question, onAnswer }: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (answerId: string) => {
    if (showResult) return;
    setSelected(answerId);
    setShowResult(true);

    const isCorrect = question.answers.find((a) => a.id === answerId)?.is_correct ?? false;

    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null);
      setShowResult(false);
    }, 1200);
  };

  return (
    <Card className={cn(
      "w-full max-w-lg mx-auto overflow-hidden transition-all duration-300",
      showResult && selected && question.answers.find(a => a.id === selected)?.is_correct 
        ? "animate-pulse-success" 
        : showResult && selected 
          ? "animate-shake" 
          : "animate-bounce-in"
    )}>
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <span className="text-7xl block mb-4" role="img" aria-label="Question emoji">
            {question.emoji}
          </span>
          <p className="text-muted-foreground text-sm">¿Qué representan estos emojis?</p>
        </div>

        <div className="space-y-3">
          {question.answers.map((answer) => {
            const isSelected = selected === answer.id;
            const isCorrect = answer.is_correct;

            return (
              <Button
                key={answer.id}
                variant="outline"
                className={cn(
                  "w-full py-6 text-lg font-medium transition-all duration-300",
                  !showResult && "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                  showResult && isSelected && isCorrect && "bg-success text-success-foreground border-success",
                  showResult && isSelected && !isCorrect && "bg-destructive text-destructive-foreground border-destructive",
                  showResult && !isSelected && isCorrect && "bg-success/20 border-success",
                  showResult && "cursor-default"
                )}
                onClick={() => handleSelect(answer.id)}
                disabled={showResult}
              >
                {answer.text}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
