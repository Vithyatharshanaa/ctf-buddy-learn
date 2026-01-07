import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TerminalCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  glowing?: boolean;
}

export default function TerminalCard({ title, children, className, glowing = false }: TerminalCardProps) {
  return (
    <div className={cn(
      "terminal-card overflow-hidden",
      glowing && "animate-pulse-glow",
      className
    )}>
      <div className="terminal-header">
        <div className="terminal-dot bg-red-500" />
        <div className="terminal-dot bg-yellow-500" />
        <div className="terminal-dot bg-green-500" />
        {title && (
          <span className="ml-2 text-xs font-mono text-muted-foreground">
            {title}
          </span>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
