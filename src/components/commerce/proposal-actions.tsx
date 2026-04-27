"use client";

import { useState } from "react";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";
import { exportProposalToPDF } from "@/lib/export-pdf";

import { createShareableOffer } from "@/app/proposals/actions";
import { Share2, Check, Copy } from "lucide-react";

export function ProposalActions({ proposal }: { proposal: any }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      await exportProposalToPDF(proposal);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Не удалось сгенерировать PDF. Попробуйте распечатать страницу (Ctrl+P).");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const res = await createShareableOffer(proposal.id);
      if (res.success && res.token) {
        setShareToken(res.token);
      } else {
        alert("Ошибка при создании ссылки: " + res.error);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/offer/${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-8 flex flex-col gap-4 print:hidden">
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={handleShare}
          disabled={isSharing}
          className="gap-2 border-[#8E623E] text-[#8E623E] hover:bg-[#8E623E] hover:text-white transition-all shadow-sm"
        >
          <Share2 className={`h-4 w-4 ${isSharing ? "animate-pulse" : ""}`} />
          {isSharing ? "Создание ссылки..." : "Поделиться веб-версией"}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleDownloadPDF} 
          disabled={isGenerating}
          className="gap-2 border-[#A66A3F] text-[#A66A3F] hover:bg-[#A66A3F] hover:text-white transition-all shadow-sm"
        >
          <Download className={`h-4 w-4 ${isGenerating ? "animate-bounce" : ""}`} />
          {isGenerating ? "Генерация..." : "Скачать PDF"}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.print()} 
          className="gap-2 border-[#766A5F] text-[#766A5F] hover:bg-[#766A5F] hover:text-white transition-all shadow-sm"
        >
          <Printer className="h-4 w-4" />
          Печать
        </Button>
        <Link href="/catalog">
          <Button variant="ghost">В каталог</Button>
        </Link>
      </div>

      {shareToken && (
        <div className="flex items-center gap-3 self-end rounded-[2px] bg-[#F1ECE4] p-3 text-sm animate-in fade-in slide-in-from-top-2">
          <span className="font-medium text-[#2D251E]">Ссылка готова:</span>
          <code className="rounded-[2px] bg-white px-2 py-1 text-[#766A5F]">
            {window.location.origin.replace(/^https?:\/\//, '')}/offer/{shareToken.slice(0, 8)}...
          </code>
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-1 font-bold text-[#A66A3F] hover:text-[#8E623E]"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Скопировано" : "Копировать"}
          </button>
          <a 
            href={`https://wa.me/?text=${encodeURIComponent("Ваше коммерческое предложение Haydi: " + window.location.origin + "/offer/" + shareToken)}`}
            target="_blank"
            className="rounded-[2px] bg-[#25D366] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-[#128C7E]"
          >
            WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
