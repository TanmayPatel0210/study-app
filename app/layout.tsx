import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StudyProvider } from "@/lib/store";
import AppShell from "@/components/appshell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindForge Study Copilot",
  description: "AI-powered study copilot built for Hack Club Terra",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-950">
      <body className={`${inter.className} h-full text-slate-100 antialiased`}>
        <StudyProvider>
          <AppShell>{children}</AppShell>
        </StudyProvider>
      </body>
    </html>
  );
}