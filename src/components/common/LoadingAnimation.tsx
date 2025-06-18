import { Loader2 } from 'lucide-react';

interface LoadingAnimationProps {
  message?: string;
}

export function LoadingAnimation({ message = "Processing your audio..." }: LoadingAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-card rounded-lg shadow-xl">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="text-xl font-medium text-foreground">{message}</p>
      <p className="text-sm text-muted-foreground">This might take a moment. Please wait.</p>
    </div>
  );
}
