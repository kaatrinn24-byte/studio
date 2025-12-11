'use client';

import { useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { generatePersonalizedFocusTips } from '@/ai/flows/personalized-focus-tips';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Lightbulb, Loader2, Music, PlayCircle, Timer as TimerIcon } from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

const moods = ["Stressed", "Productive", "Chill", "Tired", "Energetic"];
const durations = [15, 30, 60];
const soundscapes = [
  { id: 'lofi', name: 'Lofi Beats', description: 'Chill & study', imageId: 'soundscape-1' },
  { id: 'rain', name: 'Rainy Day', description: 'Calm & focus', imageId: 'soundscape-2' },
  { id: 'forest', name: 'Forest Walk', description: 'Nature & relax', imageId: 'soundscape-3' },
];

export default function ModeSetupPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const mode = Array.isArray(params.mode) ? params.mode[0] : String(params.mode);

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [tip, setTip] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [selectedSoundscape, setSelectedSoundscape] = useState<string>('lofi');
  const [isGenerating, startTransition] = useTransition();
  
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setTip('');
    startTransition(async () => {
      try {
        const result = await generatePersonalizedFocusTips({ mood, mode });
        setTip(result.tip);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Could not generate a tip. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };
  
  const handleStart = () => {
    router.push(`/${mode}/session?duration=${selectedDuration}&sound=${selectedSoundscape}`);
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
          <h2 className="text-xl font-bold mb-4">How are you feeling?</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
            {moods.map((mood) => (
              <Button
                key={mood}
                variant={selectedMood === mood ? 'default' : 'outline'}
                className="rounded-full px-6 h-12 shrink-0"
                onClick={() => handleMoodSelect(mood)}
              >
                {mood}
              </Button>
            ))}
          </div>
        </section>

        {(isGenerating || tip) && (
          <section>
             <Card className="overflow-hidden bg-secondary/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Lightbulb className="w-5 h-5"/>
                        <span>Focus Tip</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isGenerating && !tip ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin"/>
                            <span>Generating your personalized tip...</span>
                        </div>
                    ) : (
                        <p className="text-foreground/90">"{tip}"</p>
                    )}
                </CardContent>
             </Card>
          </section>
        )}

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
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Music className="w-5 h-5" />Soundscape</h2>
            <div className="grid grid-cols-3 gap-4">
                {soundscapes.map((sound) => {
                    const image = placeholderImages.find(p => p.id === sound.imageId);
                    const isActive = selectedSoundscape === sound.id;
                    return (
                        <div key={sound.id} className="cursor-pointer group" onClick={() => setSelectedSoundscape(sound.id)}>
                            <Card className={cn("overflow-hidden transition-all", isActive && "ring-2 ring-primary")}>
                                {image && <Image src={image.imageUrl} alt={sound.name} width={200} height={200} className="aspect-square object-cover transition-transform group-hover:scale-105" data-ai-hint={image.imageHint} />}
                            </Card>
                            <p className="font-semibold mt-2 text-sm text-center">{sound.name}</p>
                            <p className="text-xs text-muted-foreground text-center">{sound.description}</p>
                        </div>
                    )
                })}
            </div>
        </section>
      </div>

      <div className="p-4 border-t bg-background/80 backdrop-blur-sm sticky bottom-0">
        <Button size="lg" className="w-full h-14 text-lg rounded-full" onClick={handleStart} disabled={!selectedMood}>
            <PlayCircle className="mr-2"/>
            Start {mode} Session
        </Button>
      </div>
    </div>
  );
}
