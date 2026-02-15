interface ScoreDisplayProps {
  score: number;
  total: number;
  current?: number;
}

export function ScoreDisplay({ score, total, current }: ScoreDisplayProps) {
  const progressPercent = current != null && total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center gap-3 bg-card rounded-full px-6 py-3 shadow-lg">
        <span className="text-xl font-bold text-foreground">
          {current != null ? `${current} / ${total}` : `${score} / ${total}`}
        </span>
        <span className="text-sm text-muted-foreground">({progressPercent}%)</span>
      </div>
    </div>
  );
}
