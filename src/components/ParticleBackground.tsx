"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const defaultOptions: ISourceOptions = {
  fullScreen: { enable: false },
  particles: {
    number: { value: 50, density: { enable: true, width: 800, height: 400 } },
    color: { value: ["#4A7FA7", "#B3CFE5", "#1A3D63", "#F6FAFD"] },
    shape: { type: "circle" },
    opacity: {
      value: { min: 0.15, max: 0.4 },
      animation: { enable: true, speed: 1, sync: false },
    },
    size: { value: { min: 0.5, max: 2 } },
    links: {
      enable: true,
      distance: 120,
      color: "#4A7FA7",
      opacity: 0.2,
      width: 0.5,
    },
    move: {
      enable: true,
      speed: 1,
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
      grab: { distance: 140, links: { opacity: 0.4 } },
      push: { quantity: 2 },
    },
  },
  retina_detect: true,
};

interface ParticleBackgroundProps {
  className?: string;
  options?: ISourceOptions;
}

export function ParticleBackground({ className = "", options }: ParticleBackgroundProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      setReady(true);
    });
  }, []);

  if (!ready) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <Particles
        id="tsparticles"
        options={options ?? defaultOptions}
        className="w-full h-full"
      />
    </div>
  );
}
