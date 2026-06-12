"use client";

export function BlogTopicsWaveTop() {
  return (
    <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180" style={{ height: "80px" }}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block w-full h-full">
        <path
          d="M0,20 C180,60 360,80 540,65 C720,50 900,15 1080,25 C1260,35 1380,55 1440,60 L1440,80 L0,80 Z"
          fill="#FDF6EE"
        />
        <path
          d="M0,35 C200,65 400,75 600,55 C800,35 1000,20 1200,30 C1340,37 1400,50 1440,55 L1440,80 L0,80 Z"
          fill="#FDF6EE"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

export function BlogTopicsWaveBottom() {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" style={{ height: "80px" }}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block w-full h-full">
        <path
          d="M0,30 C240,70 480,75 720,50 C960,25 1200,40 1320,50 L1440,45 L1440,80 L0,80 Z"
          fill="#FDF6EE"
        />
        <path
          d="M0,45 C300,70 600,60 900,35 C1100,20 1300,40 1440,50 L1440,80 L0,80 Z"
          fill="#FDF6EE"
          opacity="0.45"
        />
      </svg>
    </div>
  );
}
