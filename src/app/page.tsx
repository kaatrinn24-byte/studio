'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, BookOpen, Crosshair, Headphones, Loader2, Lightbulb } from "lucide-react";
import { ModeCard } from "@/components/mode-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { generatePersonalizedFocusTips } from '@/ai/flows/personalized-focus-tips';

const modes = [
  {
    name: 'Study',
    description: 'Deep work & notes',
    icon: BookOpen,
    href: '/study',
    colorClass: 'text-secondary',
    bgClass: 'bg-secondary/10',
    borderClass: 'hover:border-secondary/50'
  },
  {
    name: 'Work',
    description: 'Intense concentration',
    icon: Crosshair,
    href: '/work',
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10',
    borderClass: 'hover:border-primary/50'
  },
  {
    name: 'Relax',
    description: 'Ambient sounds & calm',
    icon: Headphones,
    href: '/relax',
    colorClass: 'text-chart-3',
    bgClass: 'bg-chart-3/10',
    borderClass: 'hover:border-chart-3/50'
  }
];

const moods = ["Stressed", "Productive", "Chill", "Tired", "Energetic"];

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<{ name: string; href: string } | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [tip, setTip] = useState<string>('');
  const [isGenerating, startTransition] = useTransition();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);
  
  const handleModeClick = (mode: { name: string; href: string; }) => {
    setSelectedMode(mode);
    setSelectedMood(null);
    setTip('');
    setIsDialogOpen(true);
  };
  
  const handleMoodSelect = (mood: string) => {
    if (!selectedMode) return;
    setSelectedMood(mood);
    setTip('');
    startTransition(async () => {
      try {
        const result = await generatePersonalizedFocusTips({ mood, mode: selectedMode.name.toLowerCase() });
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

  const handleProceed = () => {
    if (selectedMode && selectedMood) {
      setIsDialogOpen(false);
      router.push(`${selectedMode.href}?mood=${encodeURIComponent(selectedMood)}`);
    }
  };
  
  if (isUserLoading || !user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between p-6 z-10">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-primary/50">
              {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
              <AvatarFallback>{user.displayName ? user.displayName.charAt(0) : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-xs font-medium uppercase text-primary">Welcome back</span>
              <h2 className="text-xl font-bold leading-tight text-foreground">{user.displayName || user.email}</h2>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full bg-card border-border/50 border">
            <Settings className="h-5 w-5" />
          </Button>
        </header>
        <div className="flex-1 flex flex-col p-6 pt-2 z-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-foreground">
              Find your<br /> <span className="text-primary">perfect flow</span>
            </h1>
            <p className="text-sm text-muted-foreground">Select a mode to begin your session.</p>
          </div>
          <div className="flex flex-col gap-5">
            {modes.map((mode) => (
                <div key={mode.name} onClick={() => handleModeClick(mode)}>
                    <ModeCard {...mode} />
                </div>
            ))}
          </div>
          <div className="mt-auto pt-10 text-center opacity-60">
            <p className="text-sm font-medium tracking-wide">"One step at a time."</p>
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Focus Tip</DialogTitle>
            <DialogDescription>
              Before we start, how are you feeling right now? This will help us give you a personalized tip.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <h3 className="text-sm font-semibold mb-2">Select your current mood:</h3>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <Button
                  key={mood}
                  variant={selectedMood === mood ? 'default' : 'outline'}
                  className="rounded-full"
                  onClick={() => handleMoodSelect(mood)}
                  disabled={isGenerating}
                >
                  {mood}
                </Button>
              ))}
            </div>
          </div>
          {(isGenerating || tip) && (
            <div className="mt-4 rounded-lg bg-secondary/20 p-4">
              <h4 className="flex items-center gap-2 font-semibold text-primary">
                <Lightbulb className="w-4 h-4" />
                Here's a tip for you:
              </h4>
              {isGenerating && !tip ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Loader2 className="w-4 h-4 animate-spin"/>
                  <span>Generating your tip...</span>
                </div>
              ) : (
                <p className="text-foreground/90 mt-2 italic">"{tip}"</p>
              )}
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button onClick={handleProceed} disabled={!selectedMood || isGenerating} className="w-full">
              Proceed to Setup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
