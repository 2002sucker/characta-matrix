'use server';

import OpenAI from 'openai';
import { CharacterStats } from '../types';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  baseURL: 'https://api.x.ai/v1',
});

export async function generateCharacterStats(
  characterName: string
): Promise<CharacterStats> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'grok-beta',
      messages: [
        {
          role: 'system',
          content: 'You are Grok, you are accurate with everything you know of',
        },
        {
          role: 'user',
          content: `Generate character stats for ${characterName}. Include Strength, Agility, Durability, Endurance, IQ, Strategy, Empathy, Charisma, Leadership, Combat Skill, Reflexes, Magical Ability, Survival Skills, Adaptability, Willpower, Manipulation, Regeneration, Legacy. Return only the numeric values between 0-100.make precise and accurate values don't hallucinate, Character either from anime, movies, cartoons, manga, or real life make sure your accurate.`,
        },
      ],
    });

    const response = completion.choices[0].message.content;
    // @ts-ignore
    const values = response.match(/\d+/g)?.map(Number) || [];

    if (values.length !== 18) {
      console.warn(
        `Expected 18 stats but got ${values.length}. Filling with random values.`
      );
    }

    const stats = [
      'Strength',
      'Agility',
      'Durability',
      'Endurance',
      'IQ',
      'Strategy',
      'Empathy',
      'Charisma',
      'Leadership',
      'Combat Skill',
      'Reflexes',
      'Magical Ability',
      'Survival Skills',
      'Adaptability',
      'Willpower',
      'Manipulation',
      'Regeneration',
      'Legacy',
    ].map((stat, index) => ({
      stat,
      value: values[index] || Math.floor(Math.random() * 100),
    }));

    return {
      name: characterName,
      stats,
    };
  } catch (error) {
    console.error('Error generating stats:', error);
    throw new Error('Failed to generate character stats');
  }
}
