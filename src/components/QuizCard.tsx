import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Question } from "@/hooks/useQuestions";
import { useHasVoted, useSubmitVote } from "@/hooks/useVotes";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  question: Question;
  onAnswer: (correct: boolean, questionId?: string, answerId?: string) => void;
}

export function QuizCard({ question, onAnswer }: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const { data: hasVoted, isLoading: checkingVote } = useHasVoted(question.id);
  const submitVote = useSubmitVote();

  // Auto-skip if already voted
  useEffect(() => {
    if (hasVoted) {
      onAnswer(false, question.id);
    }
  }, [hasVoted]);

  const handleSelect = async (answerId: string) => {
    if (selected || hasVoted) return;
    setSelected(answerId);

    const isCorrect = question.answers.find((a) => a.id === answerId)?.is_correct ?? false;

    try {
      await submitVote.mutateAsync({
        questionId: question.id,
        answerId: answerId,
      });
    } catch (error) {
      console.error("Failed to submit vote:", error);
    }

    setTimeout(() => {
      onAnswer(isCorrect, question.id, answerId);
      setSelected(null);
    }, 500);
  };

  if (checkingVote) {
    return null;
  }

  if (hasVoted) {
    return null;
  }

  return (
    <Card className="w-full max-w-lg mx-auto overflow-hidden transition-all duration-300 animate-bounce-in">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <span className="text-7xl block mb-4" role="img" aria-label="Question emoji">
            {question.emoji}
          </span>
          <p className="text-muted-foreground text-sm">¿Qué preferís?</p>
        </div>

        <div className="space-y-3">
          {question.answers.map((answer) => {
            const isSelected = selected === answer.id;

            return (
              <Button
                key={answer.id}
                variant="outline"
                className={cn(
                  "w-full py-6 text-lg font-medium transition-all duration-300",
                  !selected && "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                  isSelected && "bg-primary text-primary-foreground border-primary",
                  selected && !isSelected && "opacity-50",
                  selected && "cursor-default"
                )}
                onClick={() => handleSelect(answer.id)}
                disabled={!!selected}
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
