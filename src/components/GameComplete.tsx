import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Question } from "@/hooks/useQuestions";
import { useVoteCounts } from "@/hooks/useVotes";
import { cn } from "@/lib/utils";

interface GameCompleteProps {
  score: number;
  total: number;
  onRestart: () => void;
  questions: Question[];
  playerName: string;
  playerAnswers: Record<string, string>;
}

function QuestionResult({
  question,
  playerAnswerId,
}: {
  question: Question;
  playerAnswerId?: string;
}) {
  const { data: voteCounts = {} } = useVoteCounts(question.id);
  const totalVotes = Object.values(voteCounts).reduce((sum, c) => sum + c, 0);
  const getPercentage = (answerId: string) => {
    if (totalVotes === 0) return 0;
    return Math.round(((voteCounts[answerId] || 0) / totalVotes) * 100);
  };

  const maxPct = Math.max(...question.answers.map((a) => getPercentage(a.id)));
  const mostVotedIds = question.answers
    .filter((a) => getPercentage(a.id) === maxPct && maxPct > 0)
    .map((a) => a.id);

  const playerMatchedMajority = playerAnswerId
    ? mostVotedIds.includes(playerAnswerId)
    : false;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 justify-center">
        <span className="text-2xl">{question.emoji}</span>
        {playerAnswerId && (
          <span
            className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full",
              playerMatchedMajority
                ? "bg-success/20 text-success"
                : "bg-destructive/20 text-destructive"
            )}
          >
            {playerMatchedMajority ? "✓ Mayoría" : "✗ Minoría"}
          </span>
        )}
      </div>
      {question.answers.map((answer) => {
        const pct = getPercentage(answer.id);
        const isMostVoted = totalVotes > 0 && pct === maxPct && pct > 0;
        const isPlayerChoice = playerAnswerId === answer.id;

        return (
          <div
            key={answer.id}
            className={cn(
              "relative overflow-hidden rounded-md border px-4 py-2 text-sm",
              isMostVoted
                ? "border-success bg-success/10 font-semibold"
                : "border-border",
              isPlayerChoice && !isMostVoted && "border-destructive bg-destructive/10"
            )}
          >
            <span className="relative z-10 flex justify-between">
              <span>
                {isPlayerChoice && "👉 "}
                {answer.text}
              </span>
              {totalVotes > 0 && (
                <span className="text-muted-foreground">{pct}%</span>
              )}
            </span>
            {totalVotes > 0 && (
              <div
                className={cn(
                  "absolute left-0 top-0 h-full opacity-15",
                  isMostVoted ? "bg-success" : "bg-muted-foreground"
                )}
                style={{ width: `${pct}%` }}
              />
            )}
          </div>
        );
      })}
      {totalVotes > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {totalVotes} {totalVotes === 1 ? "voto" : "votos"}
        </p>
      )}
    </div>
  );
}

export function GameComplete({
  onRestart,
  questions,
  playerName,
  playerAnswers,
}: GameCompleteProps) {
  // Count how many matched majority
  return (
    <Card className="w-full max-w-lg mx-auto animate-bounce-in">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <span className="text-8xl block mb-4">🎉</span>
          <h2 className="text-3xl font-bold mb-2">¡Bien hecho, {playerName}!</h2>
          <p className="text-muted-foreground">
            Mirá cómo se comparan tus respuestas con las de los demás
          </p>
        </div>

        <div className="flex justify-center gap-6 mb-6">
          <div className="text-center">
            <span className="text-success text-2xl font-bold">✓</span>
            <p className="text-xs text-muted-foreground">= Mayoría</p>
          </div>
          <div className="text-center">
            <span className="text-destructive text-2xl font-bold">✗</span>
            <p className="text-xs text-muted-foreground">= Minoría</p>
          </div>
        </div>

        <div className="space-y-6 mb-6">
          {questions.map((q) => (
            <QuestionResult
              key={q.id}
              question={q}
              playerAnswerId={playerAnswers[q.id]}
            />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" onClick={onRestart} className="px-8">
            Jugar de nuevo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
