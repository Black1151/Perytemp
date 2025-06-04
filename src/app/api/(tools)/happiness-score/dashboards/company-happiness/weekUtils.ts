// weekUtils.ts
export function getWeekNumber(date: Date): [number, number] {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  const weekNo = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  return [target.getFullYear(), weekNo];
}

export interface WeekData {
  weekKey: string;
  startDate: Date;
  endDate: Date;
}

/**
 * Generate all week blocks from startDate to endDate (inclusive).
 */
export function getAllWeekKeysBetween(
  startDate: Date,
  endDate: Date
): WeekData[] {
  const weeks: WeekData[] = [];
  let currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  // Align to Monday
  currentDate.setDate(currentDate.getDate() - ((currentDate.getDay() + 6) % 7));

  while (currentDate <= endDate) {
    const [year, weekNo] = getWeekNumber(currentDate);
    const weekKey = `${year}-W${weekNo}`;

    // End of this week is Sunday (Monday + 6 days)
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6); // Sunday

    weeks.push({ weekKey, startDate: weekStart, endDate: weekEnd });
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return weeks;
}
