import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#07080C",
          color: "#F2EFE9",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 36, fontWeight: 700 }}>
          <div style={{ width: 22, height: 22, background: "#FF4D2E", transform: "rotate(45deg)" }} />
          {site.name}
        </div>
        <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1, letterSpacing: -3, maxWidth: 980 }}>
          {site.tagline}
        </div>
        <div style={{ fontSize: 28, color: "#9A978F" }}>{site.parentLine}</div>
      </div>
    ),
    size,
  );
}
