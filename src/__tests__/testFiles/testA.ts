// 仅用于扫描测试
export const demo = (min: number): string => {
  if (min > 15) return 'A';
  if (min > 10) return 'B';
  if (min > 5) return 'C';
  if (min <= 5) return 'D';
  return 'E';
};
