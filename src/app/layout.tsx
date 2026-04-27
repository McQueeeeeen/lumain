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
  subsets: ["latin"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "Haydi | Премиальное освещение",
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
        <nav className="glass fixed inset-x-0 top-0 z-50 h-[var(--lumain-header-height)]">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#2D251E] transition-opacity hover:opacity-80">
              <Layers className="h-6 w-6 text-[#A66A3F]" />
              <span className="font-display">
                Haydi <span className="font-normal text-[#766A5F]">light</span>
              </span>
            </Link>

            <div className="hidden lg:block">
              <NavLinks />
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <RoleSwitcher />
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-[rgba(166,106,63,0.18)] bg-white/80 text-xs font-bold text-[#766A5F] shadow-sm backdrop-blur-sm transition-transform active:scale-95">
                AM
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen pt-[var(--lumain-header-height)]">{children}</main>
        <footer className="border-t border-[rgba(166,106,63,0.18)] bg-[#FAF9F5] py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 text-sm text-[#766A5F] md:grid-cols-[2fr_1fr_1fr]">
            <div className="space-y-4">
              <div className="font-display text-3xl font-semibold text-[#2D251E]">Haydi light</div>
              <p className="max-w-xs leading-relaxed">Эксклюзивная витрина света для интерьерных решений любой сложности.</p>
            </div>
            <div>
              <div className="mb-4 text-xs font-bold uppercase tracking-widest text-[#2D251E]">Меню</div>
              <ul className="space-y-2">
                <li><Link href="/catalog" className="hover:text-[#A66A3F]">Каталог</Link></li>
                <li><Link href="/collections" className="hover:text-[#A66A3F]">Подборки</Link></li>
                <li><Link href="/proposals" className="hover:text-[#A66A3F]">КП</Link></li>
              </ul>
            </div>
            <div className="md:text-right">
              <div className="mb-4 text-xs font-bold uppercase tracking-widest text-[#2D251E]">Контакты</div>
              <div className="mt-2">&copy; 2026 Haydi.kz. Все права защищены.</div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
