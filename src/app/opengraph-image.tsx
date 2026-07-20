/* eslint-disable @next/next/no-img-element */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Ágatha faz 2 — festa em 26 de julho de 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const photo = await readFile(path.join(process.cwd(), "public", "images", "agatha", "foto-principal-bebe.png"));
  const photoSrc = `data:image/png;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#fff9fc", color: "#59445f", fontFamily: "Georgia, serif" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "radial-gradient(circle at 12% 20%, #e8ddf7 0, transparent 30%), radial-gradient(circle at 55% 90%, #fbe3ed 0, transparent 34%)" }} />
        <div style={{ width: "58%", padding: "72px 30px 60px 78px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: 5, fontWeight: 700, fontSize: 17, color: "#8c70b5" }}>
            <span style={{ width: 34, height: 2, background: "#f5bfd5", display: "flex" }} /> Convite especial
          </div>
          <div style={{ fontSize: 108, lineHeight: 0.85, marginTop: 24, letterSpacing: -6 }}>Ágatha</div>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 39, textTransform: "uppercase", letterSpacing: 9, fontWeight: 800, color: "#8c70b5", marginTop: 30 }}>faz 2!</div>
          <div style={{ fontFamily: "Arial, sans-serif", display: "flex", marginTop: 47, padding: "17px 26px", borderRadius: 999, background: "rgba(255,255,255,.82)", border: "2px solid #fff", fontSize: 22, fontWeight: 700, width: 430 }}>Domingo · 26 de julho · 12:00</div>
        </div>
        <div style={{ position: "absolute", right: 52, top: 42, width: 438, height: 548, borderRadius: "48% 48% 42% 42% / 38% 38% 58% 58%", border: "14px solid rgba(255,255,255,.92)", overflow: "hidden", boxShadow: "0 18px 50px rgba(89,68,95,.18)", display: "flex" }}>
          <img src={photoSrc} alt="" width="438" height="548" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 38%" }} />
        </div>
        <div style={{ position: "absolute", right: 18, top: 33, width: 80, height: 80, borderRadius: "50%", background: "#c9e7f5", opacity: .8, display: "flex" }} />
        <div style={{ position: "absolute", right: 470, bottom: 24, width: 54, height: 54, borderRadius: "50%", background: "#f5bfd5", opacity: .72, display: "flex" }} />
      </div>
    ),
    size,
  );
}
