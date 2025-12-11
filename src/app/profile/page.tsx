import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/placeholder-images";
import { Medal, Star, Zap } from "lucide-react";

export default function ProfilePage() {
    const userImage = placeholderImages.find(p => p.id === 'user-avatar');

    return (
        <div className="flex h-full flex-col">
            <header className="p-6 text-center">
                <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 border-4 border-primary mb-4">
                        {userImage && <AvatarImage src={userImage.imageUrl} alt={userImage.description} data-ai-hint={userImage.imageHint}/>}
                        <AvatarFallback>ZF</AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold">Alex</h1>
                    <p className="text-muted-foreground">Joined 1 month ago</p>
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
                        <CardTitle>Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">App settings will be available here in a future update.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
