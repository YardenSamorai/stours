'use client';

interface TicketFieldProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  readOnly?: boolean;
  displayValue?: string;
  dir?: string;
  className?: string;
  /** Decorative gold accent for read-only fields */
  gold?: boolean;
}

export default function TicketField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  error,
  readOnly = false,
  displayValue,
  dir,
  className = '',
  gold = false,
}: TicketFieldProps) {
  return (
    <div className={className}>
      {/* Label */}
      <label
        className={`block text-[10px] font-semibold uppercase tracking-[0.2em] mb-2 ${
          gold ? 'text-accent-500' : 'text-slate-400'
        }`}
      >
        {label}
      </label>

      {readOnly ? (
        /* Read-only decorative value */
        <p
          className={`text-[13px] font-bold leading-tight tracking-wide ${
            gold ? 'text-slate-700' : 'text-slate-700'
          }`}
        >
          {displayValue || value}
        </p>
      ) : (
        <>
          {/* Editable input — visible bottom border */}
          <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            dir={dir}
            aria-label={label}
            className={`
              w-full bg-transparent border-0 border-b-2
              ${error ? 'border-red-400' : 'border-slate-300'}
              focus:border-primary-500
              text-slate-800 font-semibold text-[15px]
              py-2 outline-none transition-all duration-300
              placeholder:text-slate-300 placeholder:font-normal
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
          />
          {error && (
            <p className="text-red-500 text-[11px] mt-1.5 font-medium">{error}</p>
          )}
        </>
      )}
    </div>
  );
}
