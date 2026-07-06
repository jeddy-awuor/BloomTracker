export interface ParsedTask {
  description: string;
  isCompleted: boolean;
}

export interface ParsedSection {
  weekNumber: number | null;
  weekTitle: string | null;
  tasks: ParsedTask[];
}

export interface ParseResult {
  sections: ParsedSection[];
  totalTasks: number;
}

const WEEK_PATTERN = /^Week\s+(\d+)\s*:\s*(.+)$/i;
const CHECKBOX_PATTERN = /^\s*(?:[-*•]\s*)?\[([ xX✓✔])\]\s*(.+)$/;
const NUMBERED_TASK_PATTERN = /^\s*Task\s+(\d+)\s*:\s*(.+)$/i;

function isCompletedMarker(marker: string): boolean {
  return marker.trim() !== "" && marker.toLowerCase() !== " ";
}

export function parseTaskText(text: string): ParseResult {
  const lines = text.split(/\r?\n/);
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;

  const ensureSection = () => {
    if (!currentSection) {
      currentSection = { weekNumber: null, weekTitle: null, tasks: [] };
      sections.push(currentSection);
    }
    return currentSection;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const weekMatch = trimmed.match(WEEK_PATTERN);
    if (weekMatch) {
      currentSection = {
        weekNumber: parseInt(weekMatch[1], 10),
        weekTitle: weekMatch[2].trim(),
        tasks: [],
      };
      sections.push(currentSection);
      continue;
    }

    const checkboxMatch = trimmed.match(CHECKBOX_PATTERN);
    if (checkboxMatch) {
      ensureSection().tasks.push({
        description: checkboxMatch[2].trim(),
        isCompleted: isCompletedMarker(checkboxMatch[1]),
      });
      continue;
    }

    const numberedMatch = trimmed.match(NUMBERED_TASK_PATTERN);
    if (numberedMatch) {
      ensureSection().tasks.push({
        description: trimmed.replace(/^\s*Task\s+\d+\s*:\s*/i, "").trim() || trimmed,
        isCompleted: false,
      });
    }
  }

  const nonEmptySections = sections.filter((s) => s.tasks.length > 0);
  const totalTasks = nonEmptySections.reduce((sum, s) => sum + s.tasks.length, 0);

  return { sections: nonEmptySections, totalTasks };
}
