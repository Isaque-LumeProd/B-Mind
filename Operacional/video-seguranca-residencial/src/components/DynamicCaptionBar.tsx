import React from "react";
import { interpolate, spring } from "remotion";

type DynamicCaptionBarProps = {
  readonly subtitle: string;
  readonly speechDurationMs: number;
  readonly frame: number;
  readonly fps: number;
  readonly accentColor: string;
  readonly isLightSurface: boolean;
};

type WordToken = {
  readonly word: string;
  readonly startMs: number;
  readonly endMs: number;
  readonly pageIndex: number;
};

const WORDS_PER_PAGE = 4;

const buildWordTokens = (
  subtitle: string,
  speechDurationMs: number
): readonly WordToken[] => {
  const rawWords = subtitle.trim().split(/\s+/);
  const totalCharWeight = rawWords.reduce(
    (sum, w) => sum + Math.max(3, w.length),
    0
  );

  let cursorMs = 80;
  const usableMs = Math.max(1000, speechDurationMs - 160);

  return rawWords.map((word, idx) => {
    const weight = Math.max(3, word.length) / totalCharWeight;
    const wordDur = weight * usableMs;
    const startMs = cursorMs;
    const endMs = cursorMs + wordDur;
    cursorMs = endMs;
    return {
      word,
      startMs,
      endMs,
      pageIndex: Math.floor(idx / WORDS_PER_PAGE),
    };
  });
};

export const DynamicCaptionBar: React.FC<DynamicCaptionBarProps> = ({
  subtitle,
  speechDurationMs,
  frame,
  fps,
  accentColor,
  isLightSurface,
}) => {
  const tokens = buildWordTokens(subtitle, speechDurationMs);
  const currentTimeMs = (frame / fps) * 1000;

  const activeTokenIndex = tokens.findIndex(
    (t) => currentTimeMs >= t.startMs && currentTimeMs < t.endMs
  );
  const clampedActiveIndex =
    activeTokenIndex !== -1
      ? activeTokenIndex
      : currentTimeMs >= speechDurationMs
        ? tokens.length - 1
        : 0;

  const activePageIndex = tokens[clampedActiveIndex]?.pageIndex ?? 0;
  const pageTokens = tokens.filter((t) => t.pageIndex === activePageIndex);
  const pageStartMs = pageTokens[0]?.startMs ?? 0;
  const pageStartFrame = Math.floor((pageStartMs / 1000) * fps);

  const pagePop = spring({
    frame: Math.max(0, frame - pageStartFrame),
    fps,
    config: { damping: 18, stiffness: 260 },
  });

  const translateY = interpolate(pagePop, [0, 1], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        backgroundColor: isLightSurface
          ? "rgba(20, 20, 19, 0.94)"
          : "rgba(24, 24, 27, 0.92)",
        borderRadius: 28,
        padding: "26px 36px",
        border: isLightSurface
          ? "1px solid rgba(20, 20, 19, 0.12)"
          : "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.28)",
        transform: `translateY(${translateY}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px 14px",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 72,
        }}
      >
        {pageTokens.map((token) => {
          const isSpeakingNow =
            currentTimeMs >= token.startMs && currentTimeMs < token.endMs;
          const isAlreadySpoken = currentTimeMs >= token.endMs;

          return (
            <span
              key={`${token.pageIndex}-${token.startMs}`}
              style={{
                fontSize: 44,
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: -0.8,
                padding: isSpeakingNow ? "4px 16px" : "4px 6px",
                borderRadius: 14,
                backgroundColor: isSpeakingNow ? accentColor : "transparent",
                color: isSpeakingNow
                  ? "#FFFFFF"
                  : isAlreadySpoken
                    ? "#F8FAFC"
                    : "rgba(248, 250, 252, 0.48)",
                transform: isSpeakingNow ? "scale(1.06)" : "scale(1)",
                display: "inline-block",
              }}
            >
              {token.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

