import Link from 'next/link';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ModeCardProps = {
  icon: LucideIcon;
  name: string;
  description: string;
  href: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
};

export function ModeCard({ icon: Icon, name, description, href, colorClass, bgClass, borderClass }: ModeCardProps) {
  return (
    <Link href={href} className="group block">
      <Card className={cn("overflow-hidden transition-all active:scale-[0.98] border-border/50", borderClass)}>
        <div className="flex items-center gap-5 p-5">
          <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl", bgClass)}>
            <Icon className={cn("h-7 w-7", colorClass)} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold leading-tight">{name}</h3>
            <p className={cn("text-xs font-medium", colorClass, "opacity-80")}>{description}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-all group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
