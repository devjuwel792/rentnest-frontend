type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
};

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-gray-200"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs font-semibold text-rose-400" id={`${htmlFor}-error`}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
