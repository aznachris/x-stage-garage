import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0f12",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 48 48" fill="none">
          <line x1="6" y1="6" x2="42" y2="42" stroke="#00AAFF" strokeWidth="6" strokeLinecap="round" />
          <line x1="42" y1="6" x2="6" y2="42" stroke="#00AAFF" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
