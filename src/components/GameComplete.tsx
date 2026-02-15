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
}

function QuestionResult({ question }: { question: Question }) {
  const { data: voteCounts = {} } = useVoteCounts(question.id);
  const totalVotes = Object.values(voteCounts).reduce((sum, c) => sum + c, 0);
  const getPercentage = (answerId: string) => {
    if (totalVotes === 0) return 0;
    return Math.round(((voteCounts[answerId] || 0) / totalVotes) * 100);
  };

  const maxPct = Math.max(...question.answers.map(a => getPercentage(a.id)));

  return (
    <div className="space-y-2">
      <p className="text-2xl text-center">{question.emoji}</p>
      {question.answers.map((answer) => {
        const pct = getPercentage(answer.id);
        const isMostVoted = totalVotes > 0 && pct === maxPct && pct > 0;

        return (
          <div
            key={answer.id}
            className={cn(
              "relative overflow-hidden rounded-md border px-4 py-2 text-sm",
              isMostVoted ? "border-success bg-success/10 font-semibold" : "border-border"
            )}
          >
            <span className="relative z-10 flex justify-between">
              <span>{answer.text}</span>
              {totalVotes > 0 && <span className="text-muted-foreground">{pct}%</span>}
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

export function GameComplete({ score, total, onRestart, questions }: GameCompleteProps) {
  const percentage = Math.round((score / total) * 100);
  const emoji = percentage >= 80 ? "🏆" : percentage >= 50 ? "👏" : "💪";

  return (
    <Card className="w-full max-w-lg mx-auto animate-bounce-in">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <span className="text-8xl block mb-4">{emoji}</span>
          <h2 className="text-3xl font-bold mb-2">¡Juego terminado!</h2>
          <p className="text-xl text-muted-foreground">
            Puntuación: <span className="font-bold text-primary">{score}/{total}</span> ({percentage}%)
          </p>
        </div>

        <div className="space-y-6 mb-6">
          <h3 className="text-lg font-semibold text-center">Resultados</h3>
          {questions.map((q) => (
            <QuestionResult key={q.id} question={q} />
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
