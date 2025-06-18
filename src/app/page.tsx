"use client";

import { useState } from 'react';
import { AppHeader } from '@/components/layout/Header';
import { FileUpload } from '@/components/FileUpload';
import { AudioTrackCard } from '@/components/AudioTrackCard';
import { LoadingAnimation } from '@/components/common/LoadingAnimation';
import { AdPlaceholder } from '@/components/common/AdPlaceholder';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { separateAudio, type SeparateAudioInput, type SeparateAudioOutput } from '@/ai/flows/audio-separation';
import { fileToDataUri } from '@/lib/utils';
import { ArrowLeft, Wand2 } from 'lucide-react';

type ProcessingState = 'idle' | 'file_selected' | 'processing' | 'results' | 'error';

export default function VocaSeparatorPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [vocalTrackUri, setVocalTrackUri] = useState<string | null>(null);
  const [instrumentalTrackUri, setInstrumentalTrackUri] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setAudioFile(file);
    setProcessingState('file_selected');
    setVocalTrackUri(null);
    setInstrumentalTrackUri(null);
    setErrorMessage(null);
    try {
      const dataUri = await fileToDataUri(file);
      setAudioDataUri(dataUri);
    } catch (error) {
      toast({
        title: "File Error",
        description: "Could not read the selected file.",
        variant: "destructive",
      });
      setProcessingState('idle');
    }
  };

  const handleProcessAudio = async () => {
    if (!audioDataUri || !audioFile) {
      toast({
        title: "No File",
        description: "Please select an audio file first.",
        variant: "destructive",
      });
      return;
    }

    setProcessingState('processing');
    setErrorMessage(null);

    try {
      const input: SeparateAudioInput = { audioDataUri };
      const output: SeparateAudioOutput = await separateAudio(input);

      if (output.vocalTrackDataUri && output.instrumentalTrackDataUri) {
        setVocalTrackUri(output.vocalTrackDataUri);
        setInstrumentalTrackUri(output.instrumentalTrackDataUri);
        setProcessingState('results');
        toast({
          title: "Success!",
          description: "Audio successfully separated.",
        });
      } else {
        throw new Error("AI did not return separated tracks.");
      }
    } catch (error: any) {
      console.error("Error separating audio:", error);
      const message = error.message || "An unknown error occurred during audio separation.";
      setErrorMessage(message);
      setProcessingState('error');
      toast({
        title: "Processing Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setAudioFile(null);
    setAudioDataUri(null);
    setProcessingState('idle');
    setVocalTrackUri(null);
    setInstrumentalTrackUri(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        {processingState === 'idle' && (
          <section className="w-full flex flex-col items-center space-y-8">
            <h2 className="text-4xl font-headline font-semibold text-center text-foreground mt-8">
              Separate Vocals & Music Instantly
            </h2>
            <p className="text-lg text-muted-foreground text-center max-w-2xl">
              Upload your song and let our AI split it into vocal and instrumental tracks. Perfect for karaoke, remixes, and content creation.
            </p>
            <FileUpload onFileSelect={handleFileSelect} />
            <AdPlaceholder className="mt-12" />
          </section>
        )}

        {processingState === 'file_selected' && audioFile && (
          <section className="w-full flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-headline font-semibold text-center">Ready to Process?</h2>
            <p className="text-muted-foreground">File selected: <span className="font-medium text-primary">{audioFile.name}</span></p>
            <div className="flex space-x-4">
              <Button onClick={handleReset} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Change File
              </Button>
              <Button onClick={handleProcessAudio} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Wand2 className="mr-2 h-4 w-4" /> Start Separation
              </Button>
            </div>
          </section>
        )}

        {processingState === 'processing' && (
          <section className="w-full flex flex-col items-center space-y-8 text-center">
            <LoadingAnimation message="Separating tracks with AI magic..." />
            <AdPlaceholder />
          </section>
        )}

        {(processingState === 'results' || processingState === 'error') && (
          <section className="w-full flex flex-col items-center space-y-8">
            <Button onClick={handleReset} variant="outline" className="self-start mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Process Another File
            </Button>

            {processingState === 'error' && errorMessage && (
              <div className="p-4 bg-destructive/20 border border-destructive text-destructive-foreground rounded-md text-center">
                <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong.</h3>
                <p>{errorMessage}</p>
                <p className="mt-2 text-sm">Please try again with a different file or check your connection.</p>
              </div>
            )}

            {processingState === 'results' && (
              <>
                <h2 className="text-3xl font-headline font-semibold text-center">Separation Complete!</h2>
                <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
                  <AudioTrackCard title="Vocal Track" trackUri={vocalTrackUri} iconType="vocal" />
                  <AudioTrackCard title="Instrumental Track" trackUri={instrumentalTrackUri} iconType="instrumental" />
                </div>
                <Separator className="my-8" />
                <AdPlaceholder />
                <div className="text-center text-sm text-muted-foreground p-4 bg-card rounded-md max-w-md">
                  <p className="font-semibold">Pro Tip:</p>
                  <p>Use the controls above to fine-tune pitch and tempo before downloading.</p>
                  <p className="mt-2">Free version downloads are simulated and may include a watermark notice.</p>
                </div>
              </>
            )}
          </section>
        )}
      </main>
      <footer className="text-center py-6 border-t border-border text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Voca Separator. Powered by AI.</p>
      </footer>
    </div>
  );
}
