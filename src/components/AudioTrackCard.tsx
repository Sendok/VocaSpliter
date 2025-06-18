"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PitchControl } from '@/components/controls/PitchControl';
import { TempoControl } from '@/components/controls/TempoControl';
import { CompressionOptions } from '@/components/controls/CompressionOptions';
import { Download, Play, Pause, Mic2, Music, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioTrackCardProps {
  title: string;
  trackUri: string | null;
  iconType: 'vocal' | 'instrumental';
}

export function AudioTrackCard({ title, trackUri, iconType }: AudioTrackCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [pitch, setPitch] = useState(0);
  const [tempo, setTempo] = useState(1);
  const [bitrate, setBitrate] = useState("128");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (audioRef.current && trackUri) {
      audioRef.current.src = trackUri;
    }
  }, [trackUri]);

  const togglePlayPause = () => {
    if (!audioRef.current || !trackUri) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        toast({
          title: "Playback Error",
          description: "Could not play audio: " + error.message,
          variant: "destructive",
        });
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  const handleDownload = () => {
    if (!trackUri) {
      toast({ title: "Error", description: "No track to download.", variant: "destructive" });
      return;
    }
    // Actual pitch/tempo/compression is complex and would usually be backend.
    // This is a placeholder for download functionality.
    toast({
      title: "Download Started (Simulated)",
      description: `Downloading ${title} with Pitch: ${pitch}, Tempo: ${tempo}x, Bitrate: ${bitrate}kbps. Free version downloads are watermarked.`,
    });
    const link = document.createElement('a');
    link.href = trackUri;
    link.download = `${title.toLowerCase().replace(' ', '_')}_processed.mp3`; // Assuming MP3 output
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const TrackIcon = iconType === 'vocal' ? Mic2 : Music;

  if (!trackUri) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-3/4 mt-1"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-8 bg-muted rounded w-full"></div>
          <div className="h-8 bg-muted rounded w-full"></div>
        </CardContent>
        <CardFooter>
          <div className="h-10 bg-muted rounded w-full"></div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <TrackIcon className="w-8 h-8 text-primary" />
          <div>
            <CardTitle className="font-headline text-2xl">{title}</CardTitle>
            <CardDescription>Adjust and download your separated track.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
          <audio 
            ref={audioRef} 
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="hidden" // Hidden, custom controls used
          />
          <Button onClick={togglePlayPause} variant="outline" size="icon" aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button onClick={toggleMute} variant="outline" size="icon" aria-label={isMuted ? "Unmute" : "Mute"}>
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          {/* Placeholder for seek bar / duration - too complex for now */}
          <div className="flex-grow h-2 bg-border rounded-full mx-2 relative">
            <div className="absolute left-0 top-0 h-full bg-primary rounded-full" style={{width: '0%'}}></div>
          </div>
        </div>

        <PitchControl onChange={setPitch} disabled={!trackUri} />
        <TempoControl onChange={setTempo} disabled={!trackUri} />
        <CompressionOptions onBitrateChange={setBitrate} disabled={!trackUri} />
      </CardContent>
      <CardFooter>
        <Button onClick={handleDownload} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={!trackUri}>
          <Download className="mr-2 h-5 w-5" />
          Download {title}
        </Button>
      </CardFooter>
    </Card>
  );
}
