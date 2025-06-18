"use client";

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileArchive } from 'lucide-react';

interface CompressionOptionsProps {
  onBitrateChange: (bitrate: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}

const bitrates = [
  { value: "96", label: "96 kbps (Low)" },
  { value: "128", label: "128 kbps (Standard)" },
  { value: "192", label: "192 kbps (Good)" },
  { value: "256", label: "256 kbps (High)" },
  { value: "320", label: "320 kbps (Max)" },
];

export function CompressionOptions({ onBitrateChange, defaultValue = "128", disabled }: CompressionOptionsProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <FileArchive className="w-4 h-4 text-primary" />
        MP3 Compression (Bitrate)
      </Label>
      <RadioGroup
        defaultValue={defaultValue}
        onValueChange={onBitrateChange}
        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
        disabled={disabled}
        aria-label="MP3 compression bitrate options"
      >
        {bitrates.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`br-${option.value}`} className="text-accent"/>
            <Label htmlFor={`br-${option.value}`} className="text-xs cursor-pointer">{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
