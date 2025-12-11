'use client';

import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, Medal, Star, Zap } from "lucide-react";

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await auth.signOut();
        router.push('/login');
    };
    
    if (isUserLoading || !user) {
        return (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <header className="p-6 text-center">
                <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 border-4 border-primary mb-4">
                         {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                        <AvatarFallback>{user.displayName ? user.displayName.charAt(0) : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold">{user.displayName || user.email}</h1>
                    <p className="text-muted-foreground">Joined {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}</p>
                </div>
            </header>
            <div className="flex-1 space-y-6 p-6 pt-0">
                <Card>
                    <CardHeader>
                        <CardTitle>Achievements</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                                <Medal className="h-8 w-8 text-secondary-foreground" />
                            </div>
                            <p className="font-semibold text-sm">First Session</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                                <Zap className="h-8 w-8 text-secondary-foreground" />
                            </div>
                            <p className="font-semibold text-sm">Focus Master</p>
                        </div>
                         <div className="flex flex-col items-center gap-2">
                             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                                <Star className="h-8 w-8 text-secondary-foreground" />
                            </div>
                            <p className="font-semibold text-sm">Perfect Week</p>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive" className="w-full" onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
