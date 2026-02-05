interface ScoreDisplayProps {
  score: number;
  total: number;
}

export function ScoreDisplay({ score, total }: ScoreDisplayProps) {
  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center gap-3 bg-card rounded-full px-6 py-3 shadow-lg">
        <span className="text-2xl">🎯</span>
        <span className="text-xl font-bold text-foreground">
          {score} / {total}
        </span>
      </div>
    </div>
  );
}
