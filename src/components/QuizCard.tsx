import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Question } from "@/hooks/useQuestions";
import { useVoteCounts, useHasVoted, useSubmitVote } from "@/hooks/useVotes";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
}

export function QuizCard({ question, onAnswer }: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const { data: voteCounts = {}, refetch: refetchVotes } = useVoteCounts(question.id);
  const { data: hasVoted, refetch: refetchHasVoted } = useHasVoted(question.id);
  const submitVote = useSubmitVote();

  // Calculate total votes and percentages
  const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0);
  const getPercentage = (answerId: string) => {
    if (totalVotes === 0) return 0;
    return Math.round(((voteCounts[answerId] || 0) / totalVotes) * 100);
  };

  // Show results immediately if already voted
  useEffect(() => {
    if (hasVoted) {
      setShowResult(true);
    }
  }, [hasVoted]);

  const handleSelect = async (answerId: string) => {
    if (showResult || hasVoted) return;
    setSelected(answerId);
    setShowResult(true);

    const isCorrect = question.answers.find((a) => a.id === answerId)?.is_correct ?? false;

    try {
      await submitVote.mutateAsync({
        questionId: question.id,
        answerId: answerId,
      });
      refetchVotes();
      refetchHasVoted();
    } catch (error) {
      console.error("Failed to submit vote:", error);
    }

    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null);
      setShowResult(false);
    }, 2000);
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
          <p className="text-muted-foreground text-sm">¿Qué preferís?</p>
        </div>

        <div className="space-y-3">
          {question.answers.map((answer) => {
            const isSelected = selected === answer.id;
            const isCorrect = answer.is_correct;
            const percentage = getPercentage(answer.id);

            return (
              <Button
                key={answer.id}
                variant="outline"
                className={cn(
                  "w-full py-6 text-lg font-medium transition-all duration-300 relative overflow-hidden",
                  !showResult && "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                  showResult && isSelected && isCorrect && "bg-success text-success-foreground border-success",
                  showResult && isSelected && !isCorrect && "bg-destructive text-destructive-foreground border-destructive",
                  showResult && !isSelected && isCorrect && "bg-success/20 border-success",
                  showResult && "cursor-default"
                )}
                onClick={() => handleSelect(answer.id)}
                disabled={showResult || hasVoted}
              >
                <span className="relative z-10 flex items-center justify-between w-full">
                  <span>{answer.text}</span>
                  {showResult && totalVotes > 0 && (
                    <span className="text-sm opacity-80 ml-2">{percentage}%</span>
                  )}
                </span>
                {showResult && totalVotes > 0 && (
                  <div 
                    className={cn(
                      "absolute left-0 top-0 h-full transition-all duration-500 opacity-20",
                      isCorrect ? "bg-success" : "bg-muted-foreground"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                )}
              </Button>
            );
          })}
        </div>

        {showResult && totalVotes > 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            {totalVotes} {totalVotes === 1 ? "voto" : "votos"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
