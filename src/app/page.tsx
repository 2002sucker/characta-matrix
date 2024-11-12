import { generateCharacterStats } from '@/actions/generateStats';
import CharacterMatrix from '@/components/CharacterRadarChart';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Character Stats Generator
        </h1>
        <CharacterMatrix generateStats={generateCharacterStats} />
      </div>
    </main>
  );
}
