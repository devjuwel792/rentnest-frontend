"use client";

type SubmitButtonProps = {
  children: React.ReactNode;
  loading?: boolean;
  pendingText?: string;
  className?: string;
};

const SubmitButton = ({
  children,
  loading = false,
  pendingText = "Please wait...",
  className = "",
}: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:opacity-95 hover:shadow-indigo-500/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {loading ? pendingText : children}
    </button>
  );
};

export default SubmitButton;
