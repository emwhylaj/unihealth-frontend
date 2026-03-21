"use client";

interface UniHealthLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function UniHealthLogo({
  size = "md",
  showText = true,
  className = "",
}: UniHealthLogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-xs", gap: "gap-1" },
    md: { icon: 40, text: "text-sm", gap: "gap-1.5" },
    lg: { icon: 56, text: "text-base", gap: "gap-2" },
  };

  const { icon, text, gap } = sizes[size];

  return (
    <div className={`flex flex-col items-center ${gap} ${className}`}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 40 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer left leaf/flame petal */}
        <path
          d="M20 4 C10 8, 2 16, 4 26 C6 34, 14 40, 20 42 C20 42, 20 42, 20 42 C14 36, 12 28, 16 22 C18 18, 20 14, 20 4Z"
          fill="#4ade80"
          opacity="0.85"
        />
        {/* Outer right leaf/flame petal */}
        <path
          d="M20 4 C30 8, 38 16, 36 26 C34 34, 26 40, 20 42 C20 42, 20 42, 20 42 C26 36, 28 28, 24 22 C22 18, 20 14, 20 4Z"
          fill="#4ade80"
          opacity="0.85"
        />
        {/* Inner flame core */}
        <path
          d="M20 10 C15 15, 13 21, 15 27 C17 32, 20 36, 20 42 C20 42, 23 38, 25 33 C27 27, 25 21, 20 10Z"
          fill="#86efac"
        />
        {/* Center circle base */}
        <circle cx="20" cy="41" r="4" fill="#4ade80" />
        <circle cx="20" cy="41" r="2" fill="#166534" />
      </svg>
      {showText && (
        <span
          className={`font-bold tracking-[0.2em] text-brand-accent uppercase ${text}`}
          style={{ color: "#4ade80", letterSpacing: "0.2em" }}
        >
          UNIHEALTH
        </span>
      )}
    </div>
  );
}
