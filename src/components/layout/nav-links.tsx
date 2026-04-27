"use client";

import React from "react";
import Link from "next/link";
import { FileText, History, LayoutGrid, Sparkles } from "lucide-react";
import { useViewerStore } from "@/store/viewer-store";

export function NavLinks() {
  const { role } = useViewerStore();

  return (
    <div className="flex max-w-[42vw] items-center gap-3 overflow-x-auto md:max-w-none md:gap-8 md:overflow-visible">
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
    <Link href={href} className="group relative flex shrink-0 min-h-[40px] items-center gap-2 text-sm font-medium text-[#766A5F] transition-colors hover:text-[#2D251E]">
      {icon}
      {label}
      <span className="absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-[#A66A3F] transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}
