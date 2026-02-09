"use client";

import * as animationData from "./wave_animation.json";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import type { LottieRefCurrentProps } from "lottie-react";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

type LottieWaveOptions = {
  autoplay?: boolean;
  pause?: boolean;
  start?: boolean;
  loop?: boolean;
};

interface LottieWaveProps {
  options?: LottieWaveOptions;
  height?: number;
  width?: number | string;
  scale?: number;
  className?: string;
}

export default function LottieWave({
  options,
  height = 10,
  width = "100%",
  scale = 0.9,
  className,
}: LottieWaveProps) {
  const animation = JSON.parse(JSON.stringify(animationData));
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    const instance = lottieRef.current;
    if (!instance) return;

    if (options?.pause) {
      instance.pause();
      return;
    }

    if (options?.start) {
      instance.goToAndPlay(0, true);
      return;
    }

    if (options?.autoplay === false) {
      instance.stop();
      return;
    }

    instance.play();
  }, [options?.pause, options?.start, options?.autoplay]);

  return (
    <div
      className={["lottie-wave-container", className].filter(Boolean).join(" ")}
      style={{ overflow: "visible", display: "flex", alignItems: "center" }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animation}
        autoplay={options?.autoplay ?? true}
        loop={options?.loop ?? true}
        height={height}
        width={width}
        style={{
          overflow: "visible",
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid meet",
          className: "lottie-wave-svg",
        }}
      />
    </div>
  );
}
