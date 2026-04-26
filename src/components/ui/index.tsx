import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-[#A66A3F] text-white hover:bg-[#8E623E] shadow-sm shadow-[#A66A3F]/20",
      secondary: "bg-[#2D251E] text-white hover:bg-[#3b3028]",
      outline: "border border-[#8E623E]/45 bg-transparent text-[#2D251E] hover:bg-[#F1ECE4]",
      ghost: "bg-transparent text-[#766A5F] hover:text-[#2D251E] hover:bg-[#F1ECE4]",
      danger: "bg-rose-500 text-white hover:bg-rose-600",
    };
    const sizes = {
      sm: "h-8 px-3 text-xs font-medium",
      md: "h-10 px-5 text-sm font-semibold",
      lg: "h-12 px-8 text-base font-semibold",
      icon: "h-10 w-10 flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[2px] transition-all focus:outline-none focus:ring-1 focus:ring-[#A66A3F] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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
  <div className={cn("rounded-[4px] border border-[rgba(166,106,63,0.18)] bg-white shadow-sm transition-all", className)}>
    {children}
  </div>
);

const Badge = ({ className, children, variant = "default" }: { className?: string; children: React.ReactNode; variant?: "default" | "success" | "warning" | "info" }) => {
  const variants = {
    default: "bg-[#F1ECE4] text-[#766A5F]",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-[#F1ECE4] text-[#8E623E]",
  };
  return (
    <span className={cn("inline-flex items-center rounded-[2px] px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest", variants[variant], className)}>
      {children}
    </span>
  );
};

export { Button, Card, Badge };
