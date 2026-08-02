export default function RootLoading() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </main>
  );
}
