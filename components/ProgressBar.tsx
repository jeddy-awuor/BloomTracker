interface ProgressBarProps {
  progress: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function ProgressBar({
  progress,
  size = "md",
  showLabel = true,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const heightClass = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3.5",
  }[size];

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-pink-400">Progress</span>
          <span className="font-semibold text-pink-300">{clampedProgress}%</span>
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-pink-950/60 ring-1 ring-pink-500/20 ${heightClass}`}
      >
        <div
          className={`${heightClass} rounded-full bg-gradient-to-r from-pink-400 via-blush-400 to-pink-300 transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
