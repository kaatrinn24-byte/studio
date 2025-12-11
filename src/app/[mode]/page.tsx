'use client';

import { useState, useEffect, useTransition } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Music, PlayCircle, Timer as TimerIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateSoundRecommendations, SoundRecommendation } from '@/ai/flows/sound-recommendations';
import { Skeleton } from '@/components/ui/skeleton';

const durations = [15, 30, 60];

const staticSoundscapes: SoundRecommendation[] = [
  { soundName: 'Lofi Beats', soundUrl: '/sounds/lofi.mp3', recommendationReason: 'Chill & study', source: 'local' },
  { soundName: 'Rainy Day', soundUrl: '/sounds/rain.mp3', recommendationReason: 'Calm & focus', source: 'local' },
  { soundName: 'Forest Walk', soundUrl: '/sounds/forest.mp3', recommendationReason: 'Nature & relax', source: 'local' },
];

export default function ModeSetupPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const mode = Array.isArray(params.mode) ? params.mode[0] : String(params.mode);
  const mood = searchParams.get('mood');

  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [soundscapes, setSoundscapes] = useState<SoundRecommendation[]>(staticSoundscapes);
  const [selectedSoundscape, setSelectedSoundscape] = useState<string>(staticSoundscapes[0].soundUrl);
  const [isGenerating, startTransition] = useTransition();

  useEffect(() => {
    if (mood) {
      startTransition(async () => {
        try {
          const result = await generateSoundRecommendations({ mood });
          if (result.recommendations && result.recommendations.length > 0) {
            setSoundscapes([...result.recommendations, ...staticSoundscapes]);
            setSelectedSoundscape(result.recommendations[0].soundUrl);
          }
        } catch (error) {
          console.error('Failed to get recommendations', error);
          toast({
            title: 'AI Error',
            description: 'Could not generate soundscapes. Using defaults.',
            variant: 'destructive',
          });
        }
      });
    }
  }, [mood, toast]);
  
  const handleStart = () => {
    const sound = soundscapes.find(s => s.soundUrl === selectedSoundscape);
    if (!sound) return;
    router.push(`/${mode}/session?duration=${selectedDuration}&soundName=${encodeURIComponent(sound.soundName)}&soundUrl=${encodeURIComponent(sound.soundUrl)}`);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-bold capitalize">{mode} Setup</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><TimerIcon className="w-5 h-5" />Duration</h2>
          <RadioGroup
            value={String(selectedDuration)}
            onValueChange={(value) => setSelectedDuration(Number(value))}
            className="grid grid-cols-3 gap-4"
          >
            {durations.map((duration) => (
              <div key={duration}>
                <RadioGroupItem value={String(duration)} id={`d-${duration}`} className="peer sr-only" />
                <Label
                  htmlFor={`d-${duration}`}
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 font-bold text-lg hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  {duration}
                  <span className="font-normal text-sm">min</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </section>

        <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Music className="w-5 h-5" />
              AI Soundscape {mood ? `for a ${mood} mood` : ''}
            </h2>
            {isGenerating ? (
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-28 w-full rounded-lg" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                    <Skeleton className="h-3 w-1/2 mx-auto" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {soundscapes.map((sound, index) => {
                      const isActive = selectedSoundscape === sound.soundUrl;
                      const imageUrl = sound.source === 'local' 
                        ? `/images/soundscape-${sound.soundName.toLowerCase().replace(' ', '-')}.jpg` 
                        : `https://picsum.photos/seed/${sound.soundName.replace(/\s+/g, '-')}/200/200`;
                      return (
                          <div key={index} className="cursor-pointer group" onClick={() => setSelectedSoundscape(sound.soundUrl)}>
                              <Card className={cn("overflow-hidden transition-all", isActive && "ring-2 ring-primary")}>
                                  <Image src={imageUrl} alt={sound.soundName} width={200} height={200} className="aspect-square object-cover transition-transform group-hover:scale-105" data-ai-hint="abstract music" />
                              </Card>
                              <p className="font-semibold mt-2 text-sm text-center">{sound.soundName}</p>
                              <p className="text-xs text-muted-foreground text-center truncate">{sound.recommendationReason}</p>
                          </div>
                      )
                  })}
              </div>
            )}
        </section>
      </div>

      <div className="p-4 border-t bg-background/80 backdrop-blur-sm sticky bottom-0">
        <Button size="lg" className="w-full h-14 text-lg rounded-full" onClick={handleStart}>
            <PlayCircle className="mr-2"/>
            Start {mode} Session
        </Button>
      </div>
    </div>
  );
}
