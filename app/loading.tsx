export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-text-primary">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-divider border-t-primary" />
        <div className="text-sm text-text-secondary">Loading...</div>
      </div>
    </div>
  );
}
