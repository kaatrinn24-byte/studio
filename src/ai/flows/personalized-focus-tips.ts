'use server';

/**
 * @fileOverview Generates personalized focus tips based on the selected mode and mood.
 *
 * - generatePersonalizedFocusTips - A function that generates personalized focus tips.
 * - PersonalizedFocusTipsInput - The input type for the generatePersonalizedFocusTips function.
 * - PersonalizedFocusTipsOutput - The return type for the generatePersonalizedFocusTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedFocusTipsInputSchema = z.object({
  mode: z
    .enum(['study', 'work', 'relax'])
    .describe('The selected mode: study, work, or relax.'),
  mood: z.string().describe('The user\s current mood.'),
});
export type PersonalizedFocusTipsInput = z.infer<typeof PersonalizedFocusTipsInputSchema>;

const PersonalizedFocusTipsOutputSchema = z.object({
  tip: z.string().describe('A personalized focus tip.'),
});
export type PersonalizedFocusTipsOutput = z.infer<typeof PersonalizedFocusTipsOutputSchema>;

export async function generatePersonalizedFocusTips(
  input: PersonalizedFocusTipsInput
): Promise<PersonalizedFocusTipsOutput> {
  return personalizedFocusTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFocusTipsPrompt',
  input: {schema: PersonalizedFocusTipsInputSchema},
  output: {schema: PersonalizedFocusTipsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized focus tips based on the user's selected mode and mood.

  The user has selected the following mode: {{{mode}}}
  The user is feeling: {{{mood}}}

  Based on this information, provide a single, actionable focus tip to help the user optimize their session and improve their concentration.

  The tip should be concise and easy to understand.
  `,
});

const personalizedFocusTipsFlow = ai.defineFlow(
  {
    name: 'personalizedFocusTipsFlow',
    inputSchema: PersonalizedFocusTipsInputSchema,
    outputSchema: PersonalizedFocusTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
