export function getWeekIdentifier(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function formatWeekLabel(weekIdentifier: string): string {
  const [year, week] = weekIdentifier.split("-W");
  return `Week ${week}, ${year}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function offsetWeekIdentifier(
  weekIdentifier: string,
  offsetWeeks: number
): string {
  const [yearStr, weekStr] = weekIdentifier.split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);

  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const mondayOfWeek1 = new Date(jan4);
  mondayOfWeek1.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1);

  const monday = new Date(mondayOfWeek1);
  monday.setUTCDate(mondayOfWeek1.getUTCDate() + (week - 1 + offsetWeeks) * 7);

  return getWeekIdentifier(monday);
}
