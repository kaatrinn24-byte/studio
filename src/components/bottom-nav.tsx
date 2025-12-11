'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Home, User, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/sounds', label: 'Sounds', icon: Music },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useUser();

  if (pathname === '/login') {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <nav className="sticky bottom-6 z-20 mx-6">
      <div className="flex h-16 items-center justify-around rounded-2xl border bg-card/80 px-4 shadow-lg backdrop-blur-xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                'relative flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary',
                isActive && 'text-primary'
              )}
            >
              <item.icon className="h-6 w-6" />
              {isActive && (
                <span className="absolute -bottom-2 h-1 w-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
