"use client";

import { ParticleBackground } from "@/components/ParticleBackground";
import type { ISourceOptions } from "@tsparticles/engine";

const globalOptions: ISourceOptions = {
  fullScreen: { enable: false },
  particles: {
    number: { value: 35, density: { enable: true, width: 1920, height: 1080 } },
    color: { value: ["#4A7FA7", "#B3CFE5", "#1A3D63"] },
    shape: { type: "circle" },
    opacity: { value: { min: 0.06, max: 0.22 } },
    size: { value: { min: 0.5, max: 1.8 } },
    links: {
      enable: true,
      distance: 140,
      color: "#4A7FA7",
      opacity: 0.08,
      width: 0.5,
    },
    move: {
      enable: true,
      speed: 0.6,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "out" },
    },
  },
  interactivity: {
    detectsOn: "canvas",
    events: {
      onHover: { enable: true, mode: "grab" },
      onClick: { enable: true, mode: "push" },
    },
    modes: {
      grab: { distance: 100, links: { opacity: 0.15 } },
      push: { quantity: 1 },
    },
  },
  retina_detect: true,
};

export function GlobalParticles() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <ParticleBackground
        className="w-full h-full opacity-90 dark:opacity-80"
        options={globalOptions}
      />
    </div>
  );
}
