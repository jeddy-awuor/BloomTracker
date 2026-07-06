export default function LoadingSpinner() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-pink-500/30 border-t-pink-400" />
    </div>
  );
}
