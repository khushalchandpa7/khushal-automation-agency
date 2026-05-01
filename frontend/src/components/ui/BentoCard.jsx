import { useRef } from "react";
import { gsap } from "../../lib/gsap";

const sizeMap = {
  sm: "md:col-span-1 md:row-span-1",
  md: "md:col-span-2 md:row-span-1",
  lg: "md:col-span-2 md:row-span-2",
  wide: "md:col-span-3 md:row-span-1",
  tall: "md:col-span-1 md:row-span-2",
};

const toneMap = {
  default: "bg-white border border-ink-base/8",
  ink: "bg-ink-base text-bg-base",
  mint: "bg-accent-mint text-ink-base",
  tangerine: "bg-accent-tangerine text-ink-base",
};

function BentoCard({
  size = "sm",
  tone = "default",
  className = "",
  children,
  spring = true,
  ...rest
}) {
  const ref = useRef(null);

  function handleEnter() {
    if (!spring || !ref.current) return;
    gsap.to(ref.current, {
      scale: 1.025,
      y: -4,
      duration: 0.6,
      ease: "elastic.out(1, 0.55)",
      overwrite: "auto",
    });
  }

  function handleLeave() {
    if (!spring || !ref.current) return;
    gsap.to(ref.current, {
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
  }

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`relative rounded-3xl p-7 md:p-8 shadow-soft hover:shadow-lift transition-shadow duration-300 will-change-transform ${sizeMap[size]} ${toneMap[tone]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default BentoCard;
