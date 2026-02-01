import { useCurrentFrame, useVideoConfig } from "remotion";

interface TypewriterOptions {
  charsPerSecond?: number;
  startFrame?: number;
  cursor?: boolean;
  cursorChar?: string;
}

export const useTypewriter = (
  text: string,
  options: TypewriterOptions = {}
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const {
    charsPerSecond = 25,
    startFrame = 0,
    cursor = true,
    cursorChar = "▋",
  } = options;

  const elapsed = Math.max(0, frame - startFrame);
  const charsPerFrame = charsPerSecond / fps;
  const charCount = Math.floor(elapsed * charsPerFrame);
  const displayText = text.slice(0, Math.min(charCount, text.length));
  const isTyping = charCount < text.length;
  const isComplete = charCount >= text.length;

  // Blinking cursor (blinks every 15 frames when not typing)
  const showCursor = cursor && (isTyping || (frame % 30 < 15));

  return {
    displayText,
    isTyping,
    isComplete,
    cursor: showCursor ? cursorChar : "",
    progress: Math.min(1, charCount / text.length),
  };
};
