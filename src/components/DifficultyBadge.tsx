import { cn } from '@/lib/utils';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export default function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 text-xs font-medium rounded",
        `difficulty-${difficulty}`,
        className
      )}
    >
      {difficultyLabels[difficulty]}
    </span>
  );
}
