import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import type { AnimationItem } from "lottie-web";

type FireLogoProps = {
  size?: number;
};

export function FireLogo({ size = 40 }: FireLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const anim: AnimationItem = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/animations/fire-logo.json", // file goes in public/animations/
    });

    return () => anim.destroy();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size, flexShrink: 0 }}
      aria-hidden="true"
    />
  );
}