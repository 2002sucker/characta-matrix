export interface CharacterStat {
  stat: string;
  value: number;
}

export interface CharacterStats {
  name: string;
  stats: CharacterStat[];
}

export interface ChartConfig {
  stats: {
    label: string;
    color: string;
  };
}
