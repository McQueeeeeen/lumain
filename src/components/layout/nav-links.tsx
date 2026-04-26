"use client";

import Link from "next/link";
import { FileText, LayoutGrid, Sparkles, History } from "lucide-react";
import { useViewerStore } from "@/store/viewer-store";

export function NavLinks() {
  const { role } = useViewerStore();

  return (
    <div className="hidden items-center gap-8 md:flex">
      <NavLink href="/catalog" icon={<LayoutGrid className="h-4 w-4" />} label="Каталог" />
      
      {(role === "manager" || role === "admin") && (
        <>
          <NavLink href="/proposals" icon={<FileText className="h-4 w-4" />} label="КП" />
          <NavLink href="/admin/proposals" icon={<History className="h-4 w-4" />} label="История КП" />
        </>
      )}
      
      {(role === "manager" || role === "designer" || role === "admin") && (
        <NavLink href="/collections" icon={<Sparkles className="h-4 w-4" />} label="Подборки" />
      )}
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="group relative flex items-center gap-2 text-sm font-medium text-[#766A5F] transition-colors hover:text-[#2D251E]">
      {icon}
      {label}
      <span className="absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-[#A66A3F] transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}
