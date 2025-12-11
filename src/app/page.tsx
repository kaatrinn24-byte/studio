'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Crosshair, Headphones, Loader2 } from "lucide-react";
import { ModeCard } from "@/components/mode-card";

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
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);
  
  const handleModeClick = (mode: { href: string; }) => {
    router.push(mode.href);
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
        </div>
      </div>
    </>
  );
}
