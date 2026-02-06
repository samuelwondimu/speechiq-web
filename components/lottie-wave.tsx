"use client";
import * as animationData from "./wave_animation.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

export default function LottieWave() {
  const animation = JSON.parse(JSON.stringify(animationData));

  return <Lottie animationData={animation} height={200} />;
}
