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
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
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
