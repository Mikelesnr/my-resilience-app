import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import ClientShellWrapper from "@/components/auth/ClientShellWrapper";
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";
import { AppHeader } from "@/components/AppHeader";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const serifFont = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
});

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Neuro-Resilience Gym",
  description:
    "A private digital workspace for personal stress management and mindfulness tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serifFont.variable} ${sansFont.variable} h-full antialiased`}
    >
      <body className="h-full bg-slate-50 text-slate-900 font-sans">
        <ServiceWorkerRegister />
        <AppHeader />
        <RegisterSW />
        <ClientShellWrapper>{children}</ClientShellWrapper>
      </body>
    </html>
  );
}
