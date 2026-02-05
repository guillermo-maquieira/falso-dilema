import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GameCompleteProps {
  score: number;
  total: number;
  onRestart: () => void;
}

export function GameComplete({ score, total, onRestart }: GameCompleteProps) {
  const percentage = Math.round((score / total) * 100);
  const emoji = percentage >= 80 ? "🏆" : percentage >= 50 ? "👏" : "💪";

  return (
    <Card className="w-full max-w-lg mx-auto animate-bounce-in">
      <CardContent className="p-8 text-center">
        <span className="text-8xl block mb-4">{emoji}</span>
        <h2 className="text-3xl font-bold mb-2">¡Juego terminado!</h2>
        <p className="text-xl text-muted-foreground mb-6">
          Puntuación: <span className="font-bold text-primary">{score}/{total}</span> ({percentage}%)
        </p>
        <Button size="lg" onClick={onRestart} className="px-8">
          Jugar de nuevo
        </Button>
      </CardContent>
    </Card>
  );
}
