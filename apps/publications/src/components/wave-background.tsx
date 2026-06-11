"use client";

export function WaveBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="absolute bottom-0 left-0 w-[200%] animate-wave-slow"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: "120px" }}
      >
        <path
          fill="rgba(214,178,122,0.06)"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-[200%] animate-wave-medium"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: "80px" }}
      >
        <path
          fill="rgba(214,178,122,0.04)"
          d="M0,256L48,240C96,224,192,192,288,186.7C384,181,480,203,576,218.7C672,235,768,245,864,229.3C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </div>
  );
}
