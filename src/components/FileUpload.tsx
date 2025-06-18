"use client";

import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, FileAudio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFile = useCallback((file: File | null) => {
    if (file) {
      if (file.type.startsWith('audio/')) {
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
          toast({
            title: "File too large",
            description: "Please upload an audio file smaller than 50MB.",
            variant: "destructive",
          });
          setFileName(null);
          return;
        }
        setFileName(file.name);
        onFileSelect(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file (e.g., MP3, WAV, M4A).",
          variant: "destructive",
        });
        setFileName(null);
      }
    }
  }, [onFileSelect, toast]);

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <Card className={`w-full max-w-lg transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-center">Upload Your Audio</CardTitle>
        <CardDescription className="text-center">
          Drag & drop your audio file here or click to select.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => e.preventDefault()}
          onDragEnter={handleDrag}
          className="h-full"
        >
          <label
            htmlFor="dropzone-file"
            className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors
            ${dragActive ? 'border-accent' : 'border-border'}
            ${disabled ? 'pointer-events-none' : ''}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className={`w-12 h-12 mb-4 ${dragActive ? 'text-accent' : 'text-primary'}`} strokeWidth={1.5} />
              <p className={`mb-2 text-sm ${dragActive ? 'text-accent' : 'text-muted-foreground'}`}>
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground/80">MP3, WAV, M4A, etc. (Max 50MB)</p>
            </div>
            {fileName && !dragActive && (
              <div className="absolute bottom-4 left-4 right-4 p-2 bg-background/80 rounded-md text-sm text-foreground flex items-center gap-2">
                <FileAudio className="w-5 h-5 text-primary" />
                <span className="truncate">{fileName}</span>
              </div>
            )}
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept="audio/*"
              onChange={handleChange}
              disabled={disabled}
            />
          </label>
          {dragActive && (
            <div
              className="absolute inset-0 w-full h-full rounded-lg"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            ></div>
          )}
        </form>
        <Button 
          onClick={() => document.getElementById('dropzone-file')?.click()} 
          className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={disabled}
          aria-label="Select audio file"
        >
          Select File
        </Button>
      </CardContent>
    </Card>
  );
}
