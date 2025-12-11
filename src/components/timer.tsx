'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Pause, Play, RotateCcw, X } from 'lucide-react';
import Reward from './reward';

export default function Timer() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialDuration = parseInt(searchParams.get('duration') || '15', 10) * 60;
    const soundscape = searchParams.get('sound') || 'Lofi Beats';

    const [timeLeft, setTimeLeft] = useState(initialDuration);
    const [isActive, setIsActive] = useState(true);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            setIsActive(false);
            setIsComplete(true);
            // Optionally play a sound
            return;
        }

        if (!isActive) {
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => {
        if (isComplete) return;
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(initialDuration);
        setIsComplete(false);
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const progress = (initialDuration - timeLeft) / initialDuration;
    const strokeDashoffset = 283 * (1 - progress);

    if (isComplete) {
        return <Reward onRestart={() => router.push('/')} />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-full bg-background p-8 text-center">
            <div className="relative w-72 h-72">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                        className="text-secondary"
                        strokeWidth="7"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                    />
                    <circle
                        className="text-primary"
                        strokeWidth="7"
                        strokeDasharray="283"
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <h1 className="text-7xl font-bold text-foreground tabular-nums">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </h1>
                    <p className="text-muted-foreground uppercase tracking-widest">Time left</p>
                </div>
            </div>

            <div className="flex items-center gap-4 mt-12">
                 <Button variant="outline" size="icon" className="w-16 h-16 rounded-full" onClick={resetTimer}>
                    <RotateCcw className="w-8 h-8" />
                    <span className="sr-only">Reset</span>
                </Button>
                <Button size="icon" className="w-20 h-20 rounded-full" onClick={toggleTimer}>
                    {isActive ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
                    <span className="sr-only">{isActive ? 'Pause' : 'Play'}</span>
                </Button>
                <Button variant="destructive" size="icon" className="w-16 h-16 rounded-full" onClick={() => router.push('/')}>
                    <X className="w-8 h-8" />
                    <span className="sr-only">End session</span>
                </Button>
            </div>

            <div className="mt-8 text-muted-foreground capitalize">
                <p>🎶 Playing: {soundscape.replace('-', ' ')}</p>
            </div>
        </div>
    );
}
