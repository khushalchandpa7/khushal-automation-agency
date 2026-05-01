function SectionWrap({ id, eyebrow, title, lede, children, className = "" }) {
  return (
    <section
      id={id}
      className={`w-full py-20 md:py-28 px-6 ${className}`}
    >
      <div className="max-w-container mx-auto">
        {(eyebrow || title || lede) && (
          <header className="mb-12 md:mb-16 max-w-2xl">
            {eyebrow && (
              <p
                data-entrance
                className="text-xs font-semibold tracking-widest uppercase text-accent-mint-deep mb-4"
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                data-entrance
                className="text-3xl md:text-5xl font-semibold tracking-tight text-ink-base"
              >
                {title}
              </h2>
            )}
            {lede && (
              <p
                data-entrance
                className="mt-5 text-lg text-ink-muted leading-relaxed"
              >
                {lede}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export default SectionWrap;
