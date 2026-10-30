import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Fideresto · Haz que vuelvan",
  description: "El lugar de tus clientes habituales.",
  applicationName: "Fideresto",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f4f6f2" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
