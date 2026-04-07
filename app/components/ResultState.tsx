interface ResultStateProps {
  type: "error" | "empty" | "idle";
  message: string;
}

const CONFIG = {
  idle:  { icon: "🗺",  className: "flex flex-col items-center justify-center py-20 text-stone-400" },
  empty: { icon: "🔍", className: "flex flex-col items-center justify-center py-20 text-stone-400" },
  error: { icon: null,  className: null },
} as const;

export function ResultState({ type, message }: ResultStateProps) {
  if (type === "error") {
    return (
      <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <strong>Error:</strong> {message}
      </div>
    );
  }

  const { icon, className } = CONFIG[type];
  return (
    <div className={className}>
      <span className="text-4xl mb-3 opacity-40">{icon}</span>
      <p className="text-sm">{message}</p>
    </div>
  );
}