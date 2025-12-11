import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import BottomNav from '@/components/bottom-nav';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'ZenithFlow',
  description: 'Find your perfect flow for studying, focusing, and relaxing.',
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-muted/30">
        <FirebaseClientProvider>
            <div className="relative mx-auto flex h-full min-h-[100dvh] w-full max-w-md flex-col overflow-x-hidden bg-background shadow-2xl">
              <div className="pointer-events-none absolute top-[-5%] left-[-20%] h-[300px] w-[300px] rounded-full bg-primary/10 blur-3xl" />
              <div className="pointer-events-none absolute bottom-[5%] right-[-20%] h-[300px] w-[300px] rounded-full bg-secondary/10 blur-3xl" />
              <main className="flex-1 flex flex-col z-10">{children}</main>
              <BottomNav />
            </div>
            <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
