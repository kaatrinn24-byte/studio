import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Trophy } from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';

type RewardProps = {
    onRestart: () => void;
};

export default function Reward({ onRestart }: RewardProps) {
    const rewardImage = placeholderImages.find(p => p.id === 'reward-bg');

    return (
        <div className="relative flex flex-col items-center justify-center h-full overflow-hidden p-8 text-center text-white">
            {rewardImage && (
                 <Image 
                    src={rewardImage.imageUrl} 
                    alt={rewardImage.description} 
                    fill 
                    className="object-cover z-0"
                    data-ai-hint={rewardImage.imageHint}
                 />
            )}
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <div className="z-20 flex flex-col items-center">
                <Trophy className="w-24 h-24 text-yellow-400 drop-shadow-lg" />
                <h1 className="text-4xl font-bold mt-4">Session Complete!</h1>
                <p className="text-lg mt-2 text-white/80">You've earned a reward for your focus.</p>

                <Card className="mt-12 text-foreground bg-background/90 max-w-sm">
                    <CardHeader>
                        <CardTitle>Great work!</CardTitle>
                        <CardDescription>You're one step closer to your goals.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Keep up the momentum. Every session counts towards your growth.</p>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full" onClick={onRestart}>Start New Session</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
