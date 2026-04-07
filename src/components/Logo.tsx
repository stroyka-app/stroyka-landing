interface LogoProps {
  variant?: "dark" | "light";
  size?: number;
  showWordmark?: boolean;
}

export default function Logo({
  variant = "dark",
  size = 36,
  showWordmark = true,
}: LogoProps) {
  const markColors =
    variant === "dark"
      ? {
          bracketTop: "#cad2c5",
          bracketBot: "#52796f",
          dotTop: "#84a98c",
          dotBot: "#52796f",
        }
      : {
          bracketTop: "#2f3e46",
          bracketBot: "#52796f",
          dotTop: "#354f52",
          dotBot: "#84a98c",
        };

  const textColor = variant === "dark" ? "#ffffff" : "#2f3e46";
  const dividerColor =
    variant === "dark" ? "rgba(255,255,255,0.2)" : "rgba(47,62,70,0.2)";

  return (
    <div className="flex items-center gap-3.5" role="img" aria-label="Stroyka">
      <svg
        width={size}
        height={size}
        viewBox="0 0 56 56"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 28 L6 6 L28 6"
          stroke={markColors.bracketTop}
          strokeWidth="7"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          d="M50 28 L50 50 L28 50"
          stroke={markColors.bracketBot}
          strokeWidth="7"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <circle cx="6" cy="6" r="4" fill={markColors.dotTop} />
        <circle cx="50" cy="50" r="4" fill={markColors.dotBot} />
      </svg>

      {showWordmark && (
        <>
          <div
            style={{
              width: 1,
              height: size * 0.7,
              background: dividerColor,
            }}
          />
          <span
            className="font-heading font-bold tracking-widest uppercase"
            style={{
              fontSize: size * 0.52,
              color: textColor,
              letterSpacing: "0.1em",
            }}
          >
            Stroyka
          </span>
        </>
      )}
    </div>
  );
}
