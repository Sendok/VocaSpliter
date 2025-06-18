"use client";

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Gauge } from 'lucide-react';

interface TempoControlProps {
  onChange: (value: number) => void;
  defaultValue?: number;
  disabled?: boolean;
}

export function TempoControl({ onChange, defaultValue = 1, disabled }: TempoControlProps) {
  const [tempo, setTempo] = useState(defaultValue);

  const handleTempoChange = (value: number[]) => {
    const newTempo = value[0];
    setTempo(newTempo);
    onChange(newTempo);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="tempo-slider" className="flex items-center gap-2 text-sm font-medium">
          <Gauge className="w-4 h-4 text-primary" />
          Tempo Adjustment
        </Label>
        <span className="text-xs font-mono px-2 py-1 rounded-md bg-muted text-muted-foreground">
          {tempo.toFixed(2)}x
        </span>
      </div>
      <Slider
        id="tempo-slider"
        min={0.5}
        max={2}
        step={0.05}
        defaultValue={[tempo]}
        onValueChange={handleTempoChange}
        className="[&_[role=slider]]:bg-primary"
        disabled={disabled}
        aria-label="Tempo adjustment control"
      />
    </div>
  );
}
