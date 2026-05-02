function FieldError({ messages }) {
  if (!messages || messages.length === 0) return null;
  return (
    <p className="mt-2 text-sm text-accent-tangerine-deep">
      {messages[0]}
    </p>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-surface-strong focus:border-accent-mint focus:ring-2 focus:ring-accent-mint/30 outline-none transition-colors";

function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  disabled,
  placeholder,
  errors,
  optional = false,
  rows,
}) {
  const isTextarea = type === "textarea";

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-ink-base mb-2"
      >
        {label}
        {optional && (
          <span className="text-ink-subtle font-normal"> (optional)</span>
        )}
      </label>
      {isTextarea ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
      <FieldError messages={errors} />
    </div>
  );
}

export default FormField;
