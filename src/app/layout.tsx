import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import Link from "next/link";
import { Layers } from "lucide-react";
import { RoleSwitcher } from "@/components/layout/role-switcher";
import { NavLinks } from "@/components/layout/nav-links";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const ui = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "Lumain | Премиальное освещение",
  description: "Эксклюзивная витрина света для дизайнеров и частных клиентов.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${display.variable} ${ui.variable}`}>
      <body className="overflow-x-hidden font-ui bg-[#FAF9F5] text-[#2D251E] antialiased">
        <nav className="glass fixed inset-x-0 top-0 z-50 h-16">
          <div className="mx-auto grid h-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-[#2D251E]">
              <Layers className="h-5 w-5 text-[#A66A3F]" />
              <span>
                Lumain <span className="font-normal text-[#766A5F]">light</span>
              </span>
            </Link>

            <NavLinks />

            <div className="flex items-center justify-end gap-3">
              <RoleSwitcher />
              <div className="flex h-8 w-8 items-center justify-center rounded-[2px] border border-[rgba(166,106,63,0.18)] bg-white text-xs font-bold text-[#766A5F]">
                AM
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen pt-16">{children}</main>
        <footer className="border-t border-[rgba(166,106,63,0.18)] bg-white py-10">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 text-sm text-[#766A5F] md:grid-cols-2">
            <div>
              <div className="font-display text-2xl font-semibold text-[#2D251E]">Lumain light</div>
            </div>
            <div className="md:text-right">
              <div>Каталог / Помощь / О нас</div>
              <div className="mt-2">&copy; 2026 Lumain</div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

