'use server';

/**
 * @fileOverview Generates sound recommendations based on user's mood.
 *
 * - generateSoundRecommendations - A function that generates sound recommendations.
 * - SoundRecommendationsInput - The input type for the function.
 * - SoundRecommendationsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SoundRecommendationSchema = z.object({
  source: z.string().describe('Source of the music platform (e.g., Spotify, YouTube).'),
  soundName: z.string().describe('Name of the sound/song.'),
  soundUrl: z.string().url().describe('URL for the song/sound.'),
  recommendationReason: z.string().describe('Reason for the recommendation.'),
});
export type SoundRecommendation = z.infer<typeof SoundRecommendationSchema>;


const SoundRecommendationsInputSchema = z.object({
  mood: z.string().describe("The user's current mood."),
});
export type SoundRecommendationsInput = z.infer<typeof SoundRecommendationsInputSchema>;

const SoundRecommendationsOutputSchema = z.object({
  recommendations: z.array(SoundRecommendationSchema).describe('A list of sound recommendations.'),
});
export type SoundRecommendationsOutput = z.infer<typeof SoundRecommendationsOutputSchema>;

const soundRecommendationsFlow = ai.defineFlow(
  {
    name: 'soundRecommendationsFlow',
    inputSchema: SoundRecommendationsInputSchema,
    outputSchema: SoundRecommendationsOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
        name: 'soundRecommendationsPrompt',
        input: { schema: SoundRecommendationsInputSchema },
        output: { schema: SoundRecommendationsOutputSchema },
        prompt: `You are an AI assistant that recommends sounds and music for focus, study, and relaxation.
      
        The user is feeling: {{{mood}}}
      
        Based on their mood, provide a list of 3 diverse sound recommendations from platforms like Spotify or YouTube. For each recommendation, provide the platform, the name of the sound/song, a valid URL, and a brief reason why it's a good fit for their mood.
        `,
      });

    const { output } = await prompt(input);
    return output!;
  }
);


export async function generateSoundRecommendations(
    input: SoundRecommendationsInput
  ): Promise<SoundRecommendationsOutput> {
    return soundRecommendationsFlow(input);
  }
  