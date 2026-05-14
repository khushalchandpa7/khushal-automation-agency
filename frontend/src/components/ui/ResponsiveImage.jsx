function ResponsiveImage({
  src,
  sources = [],
  alt,
  width,
  height,
  sizes,
  loading = "lazy",
  fetchPriority = "auto",
  decoding = "async",
  className = "",
  style,
  ...rest
}) {
  if (import.meta.env.DEV && (!width || !height)) {
    console.warn(
      `ResponsiveImage: width and height props are required to prevent layout shift (src=${src}).`,
    );
  }

  const aspectRatio = width && height ? `${width} / ${height}` : undefined;

  return (
    <picture>
      {sources.map((source, index) => (
        <source
          key={index}
          type={source.type}
          srcSet={source.srcSet}
          sizes={sizes ?? source.sizes}
          media={source.media}
        />
      ))}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={loading}
        fetchpriority={fetchPriority}
        decoding={decoding}
        className={className}
        style={{ aspectRatio, ...style }}
        {...rest}
      />
    </picture>
  );
}

export default ResponsiveImage;
