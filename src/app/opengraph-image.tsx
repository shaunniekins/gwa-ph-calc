import { ImageResponse } from "next/og";

export const alt = "GWA Calculator Philippines: compute your General Weighted Average";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 28,
            background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
            color: "white",
            fontSize: 40,
            fontWeight: 700,
          }}
        >
          GWA
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 76, fontWeight: 700, color: "#1f2937" }}>
          GWA Calculator Philippines
        </div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 36, color: "#4b5563" }}>
          Compute your General Weighted Average instantly.
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 30, color: "#4338ca", fontFamily: "monospace" }}>
          GWA = Σ (Grade × Units) / Σ Units
        </div>
      </div>
    ),
    size,
  );
}
