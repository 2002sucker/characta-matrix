'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import { CharacterStats, ChartConfig } from '../types';

const chartConfig: ChartConfig = {
  stats: {
    label: 'Stats',
    color: 'hsl(var(--chart-1))',
  },
};

interface CharacterMatrixProps {
  generateStats: (name: string) => Promise<CharacterStats>;
}

export default function CharacterMatrix({
  generateStats,
}: CharacterMatrixProps) {
  const [characterName, setCharacterName] = useState('');
  const [characterStats, setCharacterStats] = useState<CharacterStats | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterName.trim()) return;

    setLoading(true);
    try {
      const stats = await generateStats(characterName);
      setCharacterStats(stats);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadChart = () => {
    const svg = document.querySelector('.recharts-wrapper svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${characterStats?.name || 'character'}_stats.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <Input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Enter character name..."
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Stats'}
          </Button>
        </div>
      </form>

      {characterStats && (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader className="items-center pb-4">
            <CardTitle>{`${characterStats.name} Character Stats`}</CardTitle>
            <CardDescription>
              Radar chart showing {characterStats.name}'s abilities and traits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartContainer
              // @ts-ignore
              config={chartConfig}
              className="aspect-square w-full max-w-2xl mx-auto"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={characterStats.stats}
                  margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                >
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <PolarGrid stroke="hsl(var(--muted-foreground))" />
                  <PolarAngleAxis
                    dataKey="stat"
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  />
                  <Radar
                    name={characterStats.name}
                    dataKey="value"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex justify-center">
              <Button onClick={downloadChart}>Download Chart</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
