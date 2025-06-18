
'use server';

/**
 * @fileOverview AI-powered audio separation flow to split audio files into vocal and instrumental tracks.
 *
 * - separateAudio - A function that handles the audio separation process.
 * - SeparateAudioInput - The input type for the separateAudio function.
 * - SeparateAudioOutput - The return type for the separateAudio function.
 */

import {ai}from '@/ai/genkit';
import {z} from 'genkit';

const SeparateAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SeparateAudioInput = z.infer<typeof SeparateAudioInputSchema>;

const SeparateAudioOutputSchema = z.object({
  vocalTrackDataUri: z
    .string()
    .describe(
      'The separated vocal track as a data URI (Base64 encoded with MIME type).'
    ).optional(),
  instrumentalTrackDataUri: z
    .string()
    .describe(
      'The separated instrumental track as a data URI (Base64 encoded with MIME type).'
    ).optional(),
});
export type SeparateAudioOutput = z.infer<typeof SeparateAudioOutputSchema>;

export async function separateAudio(input: SeparateAudioInput): Promise<SeparateAudioOutput> {
  return separateAudioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'separateAudioPrompt',
  input: {schema: SeparateAudioInputSchema},
  output: {schema: SeparateAudioOutputSchema},
  prompt: `You are an expert audio engineer specializing in separating audio tracks into vocal and instrumental components.

You will receive an audio file and your task is to use your knowledge of audio separation techniques to provide two audio tracks: one containing only the vocals, and the other containing the instrumental elements.

Ensure that the separated tracks are high quality and preserve the integrity of the original audio.

Audio File: {{media url=audioDataUri}}

Output the vocal and instrumental tracks as data URIs.

Important: You must fill both vocalTrackDataUri and instrumentalTrackDataUri fields with the separated audio data URIs. Failure to do so will result in an incomplete output.
`,
});

const separateAudioFlow = ai.defineFlow(
  {
    name: 'separateAudioFlow',
    inputSchema: SeparateAudioInputSchema,
    outputSchema: SeparateAudioOutputSchema,
  },
  async input => {
    // Call the audio separation prompt to get the separated tracks
    const {output} = await prompt(input);
    return output!;
  }
);
