const variants = {
  primary:
    "bg-accent-mint text-accent-contrast can-hover:hover:bg-accent-mint-deep active:bg-accent-mint-deep shadow-soft",
  secondary:
    "bg-panel-base text-panel-text can-hover:hover:bg-panel-base/85 active:bg-panel-base/85",
  ghost:
    "border border-surface-strong text-ink-base can-hover:hover:border-accent-tangerine can-hover:hover:text-accent-tangerine active:border-accent-tangerine active:text-accent-tangerine",
};

const sizes = {
  sm: "px-4 py-3 text-sm rounded-xl min-h-touch-lg",
  md: "px-6 py-3 text-base rounded-2xl min-h-touch-lg",
  lg: "px-8 py-4 text-lg rounded-2xl min-h-touch-lg",
};

function Button({
  variant = "primary",
  size = "md",
  as: Tag = "button",
  className = "",
  children,
  ...rest
}) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Button;
