import { cn } from '@/lib/utils';

type Category = 'web' | 'crypto' | 'forensics' | 'linux' | 'reverse';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

const categoryLabels: Record<Category, string> = {
  web: 'Web',
  crypto: 'Crypto',
  forensics: 'Forensics',
  linux: 'Linux',
  reverse: 'Reverse',
};

export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        "px-3 py-1 text-xs font-mono font-medium rounded-full border",
        `category-${category}`,
        className
      )}
    >
      {categoryLabels[category]}
    </span>
  );
}
