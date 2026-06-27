import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vita-Link CNTS | Système d'Orchestration Transfusionnelle",
  description: "Portail de gestion du Centre National de Transfusion Sanguine",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }} className="bg-[#0A0A14] text-white antialiased">{children}</body>
    </html>
  );
}
