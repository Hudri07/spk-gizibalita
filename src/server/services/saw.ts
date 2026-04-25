export interface ToddlerData {
  id?: number;
  name: string;
  weight: number; // BB
  height: number; // TB
  age: number;    // Umur (months)
  gender: 'L' | 'P';
}

export interface CriteriaData {
  id: number;
  code: string;
  name: string;
  weight: number;
  type: 'benefit' | 'cost';
}

export interface SAWRanking extends ToddlerData {
  score: number;
  status: string;
}

export const calculateSAW = (data: ToddlerData[], criteria: CriteriaData[]): SAWRanking[] => {
  if (data.length === 0) return [];

  // 1. Find Max/Min values for normalization
  const extremes: Record<string, number> = {};
  
  criteria.forEach(c => {
    let values: number[] = [];
    if (c.name === 'Berat Badan') values = data.map(d => d.weight);
    else if (c.name === 'Tinggi Badan') values = data.map(d => d.height);
    else if (c.name === 'Umur') values = data.map(d => d.age);
    else if (c.name === 'Jenis Kelamin') values = data.map(d => d.gender === 'L' ? 1 : 0.8);

    if (c.type === 'benefit') {
      extremes[c.code] = Math.max(...values, 0.1);
    } else {
      extremes[c.code] = Math.min(...values, 1000);
    }
  });

  // 2. Normalization and Calculation
  const results = data.map(toddler => {
    let score = 0;
    
    criteria.forEach(c => {
      let val = 0;
      if (c.name === 'Berat Badan') val = toddler.weight;
      else if (c.name === 'Tinggi Badan') val = toddler.height;
      else if (c.name === 'Umur') val = toddler.age;
      else if (c.name === 'Jenis Kelamin') val = toddler.gender === 'L' ? 1 : 0.8;

      let r = 0;
      if (c.type === 'benefit') {
        r = val / (extremes[c.code] || 1);
      } else {
        r = (extremes[c.code] || 1) / (val || 1);
      }

      score += r * parseFloat(c.weight as any);
    });

    let status = 'Gizi Baik';
    if (score < 0.4) status = 'Gizi Buruk';
    else if (score < 0.7) status = 'Gizi Kurang';
    else if (score > 0.9) status = 'Gizi Lebih';

    return {
      ...toddler,
      score: Number(score.toFixed(4)),
      status
    };
  });

  return results.sort((a, b) => b.score - a.score);
};
