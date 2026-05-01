const variants = {
  primary:
    "bg-accent-mint text-ink-base hover:bg-accent-mint-deep shadow-soft",
  secondary:
    "bg-ink-base text-bg-base hover:bg-ink-muted",
  ghost:
    "border border-ink-base/15 text-ink-base hover:border-accent-tangerine hover:text-accent-tangerine",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-2xl",
  lg: "px-8 py-4 text-lg rounded-2xl",
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
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Button;
