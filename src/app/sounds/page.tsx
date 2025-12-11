'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { generateSoundRecommendations } from '@/ai/flows/sound-recommendations';
import type { SoundRecommendation } from '@/ai/flows/sound-recommendations';
import Link from 'next/link';

const formSchema = z.object({
  mood: z.string().min(2, {
    message: 'Mood must be at least 2 characters.',
  }),
});

export default function SoundsPage() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<SoundRecommendation[]>([]);
  const [isGenerating, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const result = await generateSoundRecommendations({ mood: values.mood });
        setRecommendations(result.recommendations);
      } catch (error) {
        console.error('Failed to get recommendations', error);
        toast({
          title: 'Error',
          description: 'Could not generate recommendations. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="flex h-full flex-col">
      <header className="p-6">
        <h1 className="text-3xl font-bold">AI Soundscapes</h1>
        <p className="text-muted-foreground">
          Get sound recommendations from AI for your focus sessions.
        </p>
      </header>

      <div className="flex-1 space-y-6 p-6 pt-0">
        <Card>
          <CardHeader>
            <CardTitle>Describe your mood</CardTitle>
            <CardDescription>
              Tell us how you're feeling, and we'll suggest some sounds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Mood</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., focused, relaxed, sleepy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Get Recommendations
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {recommendations.length > 0 && (
          <div className="space-y-4">
             <h2 className="text-2xl font-bold">Your Recommendations</h2>
            {recommendations.map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{rec.soundName}</CardTitle>
                  <CardDescription>From: {rec.source}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{rec.recommendationReason}</p>
                  <Button asChild variant="outline">
                    <Link href={rec.soundUrl} target="_blank" rel="noopener noreferrer">
                      Listen Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
