function SocialIcon({ path, label }) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      className="block"
    >
      <path d={path} />
    </svg>
  );
}

export default SocialIcon;
