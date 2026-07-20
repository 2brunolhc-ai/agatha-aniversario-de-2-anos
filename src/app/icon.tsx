import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(145deg, #e8ddf7, #fbe3ed)",
          color: "#59445f",
          display: "flex",
          fontFamily: "Georgia, serif",
          fontSize: 38,
          height: "100%",
          justifyContent: "center",
          borderRadius: "50%",
          width: "100%",
        }}
      >
        Á
      </div>
    ),
    size,
  );
}
