import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-[#A66A3F] text-white hover:bg-[#8E623E] shadow-[0_4px_12px_rgba(166,106,63,0.15)] hover:shadow-[0_6px_16px_rgba(166,106,63,0.25)]",
      secondary: "bg-[#2D251E] text-white hover:bg-[#3b3028] shadow-sm",
      outline: "border border-[rgba(166,106,63,0.22)] bg-transparent text-[#2D251E] hover:bg-[#F1ECE4] hover:border-[#A66A3F]/40",
      ghost: "bg-transparent text-[#766A5F] hover:text-[#2D251E] hover:bg-[#F1ECE4]",
      danger: "bg-rose-500 text-white hover:bg-rose-600",
    };
    const sizes = {
      sm: "h-9 px-4 text-xs font-bold uppercase tracking-wider",
      md: "h-11 px-6 text-sm font-bold uppercase tracking-wider",
      lg: "h-14 px-10 text-base font-bold uppercase tracking-widest",
      icon: "h-11 w-11 flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[2px] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#A66A3F] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("lumain-surface rounded-[4px] transition-all duration-500 hover:shadow-lg hover:-translate-y-1", className)}>
    {children}
  </div>
);

const Badge = ({ className, children, variant = "default" }: { className?: string; children: React.ReactNode; variant?: "default" | "success" | "warning" | "info" }) => {
  const variants = {
    default: "bg-[#F1ECE4] text-[#766A5F] border border-[#8E623E]/10",
    success: "bg-emerald-50/80 text-emerald-700 backdrop-blur-sm border border-emerald-200/50",
    warning: "bg-amber-50/80 text-amber-700 backdrop-blur-sm border border-amber-200/50",
    info: "bg-white/70 text-[#A66A3F] backdrop-blur-sm border border-[#A66A3F]/20",
  };
  return (
    <span className={cn("inline-flex items-center rounded-[2px] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm", variants[variant], className)}>
      {children}
    </span>
  );
};

export { Button, Card, Badge };
