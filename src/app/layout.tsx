import "./globals.css";
import type { Metadata } from "next";
import { fontModern } from "./fonts";

export const metadata: Metadata = {
  title: "Cordz",
  description: "our digital cards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fontModern.className} h-full`}>
      <body className="min-h-screen text-slate-100 antialiased relative">
        {/* Fixed background that doesn't scroll */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-10" />
        
        <div className="min-h-screen flex flex-col relative">
          <header className="sticky top-0 z-20 border-b border-slate-800/70 bg-slate-950/70 backdrop-blur-xl">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  ✧ Cordz 
                </h1>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}