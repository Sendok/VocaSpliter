"use client";

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Music3 } from 'lucide-react'; // Using Music3 as placeholder icon

interface PitchControlProps {
  onChange: (value: number) => void;
  defaultValue?: number;
  disabled?: boolean;
}

export function PitchControl({ onChange, defaultValue = 0, disabled }: PitchControlProps) {
  const [pitch, setPitch] = useState(defaultValue);

  const handlePitchChange = (value: number[]) => {
    const newPitch = value[0];
    setPitch(newPitch);
    onChange(newPitch);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="pitch-slider" className="flex items-center gap-2 text-sm font-medium">
          <Music3 className="w-4 h-4 text-primary" />
          Pitch Shifter
        </Label>
        <span className="text-xs font-mono px-2 py-1 rounded-md bg-muted text-muted-foreground">
          {pitch >= 0 ? `+${pitch}` : pitch} semitones
        </span>
      </div>
      <Slider
        id="pitch-slider"
        min={-12}
        max={12}
        step={1}
        defaultValue={[pitch]}
        onValueChange={handlePitchChange}
        className="[&_[role=slider]]:bg-primary"
        disabled={disabled}
        aria-label="Pitch shifter control"
      />
    </div>
  );
}
