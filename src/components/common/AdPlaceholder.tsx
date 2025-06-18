import { Zap } from 'lucide-react'; // Using Zap as a placeholder for an ad icon

interface AdPlaceholderProps {
  className?: string;
}

export function AdPlaceholder({ className }: AdPlaceholderProps) {
  return (
    <div
      className={`w-full max-w-md h-24 bg-muted/30 border border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground p-4 my-6 mx-auto ${className}`}
      aria-label="Advertisement placeholder"
      role="complementary"
    >
      <Zap className="w-8 h-8 mb-1 text-primary" />
      <p className="text-sm font-medium">Advertisement</p>
      <p className="text-xs">Support Voca Separator by viewing ads!</p>
    </div>
  );
}
