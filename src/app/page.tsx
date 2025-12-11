import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, BookOpen, Crosshair, Headphones } from "lucide-react";
import { ModeCard } from "@/components/mode-card";
import { placeholderImages } from "@/lib/placeholder-images";

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

export default function Home() {
  const userImage = placeholderImages.find(p => p.id === 'user-avatar');

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between p-6 z-10">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/50">
            {userImage && <AvatarImage src={userImage.imageUrl} alt={userImage.description} data-ai-hint={userImage.imageHint} />}
            <AvatarFallback>ZF</AvatarFallback>
          </Avatar>
          <div>
            <span className="text-xs font-medium uppercase text-primary">Welcome back</span>
            <h2 className="text-xl font-bold leading-tight text-foreground">Alex</h2>
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
          {modes.map((mode) => <ModeCard key={mode.name} {...mode} />)}
        </div>
        <div className="mt-auto pt-10 text-center opacity-60">
          <p className="text-sm font-medium tracking-wide">"One step at a time."</p>
        </div>
      </div>
    </div>
  );
}
