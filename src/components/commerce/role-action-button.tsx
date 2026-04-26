"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, FilePlus, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui";
import { getProductById } from "@/lib/demo-data";
import { useCheckoutStore } from "@/store/checkout-store";
import { useDesignerStore } from "@/store/designer-store";
import { useKPStore } from "@/store/kp-store";
import { useViewerStore } from "@/store/viewer-store";

export function RoleActionButton({ product, compact = false }: { product: Product; compact?: boolean }) {
  const router = useRouter();
  const role = useViewerStore((state) => state.role);
  const checkoutItems = useCheckoutStore((state) => state.items);
  const checkoutAdd = useCheckoutStore((state) => state.addItem);
  const designerItems = useDesignerStore((state) => state.items);
  const designerAdd = useDesignerStore((state) => state.addItem);
  const kpItems = useKPStore((state) => state.items);
  const kpAdd = useKPStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) {
    return null;
  }

  const isInCheckout = checkoutItems.some((item) => item.id === product.id);
  const isInDesigner = designerItems.some((item) => item.id === product.id);
  const isInProposal = kpItems.some((item) => item.id === product.id);

  const config = {
    client: {
      label: isAdded ? "Добавлено" : isInCheckout ? "Купить еще" : "Купить",
      icon: isAdded ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />,
      action: () => checkoutAdd(product),
      href: "/checkout",
    },
    designer: {
      label: isAdded ? "Добавлено" : isInDesigner ? "В подборке" : "В дизайнерскую",
      icon: isAdded ? <Check className="h-4 w-4" /> : <Heart className="h-4 w-4" />,
      action: () => designerAdd(product),
      href: "/collections",
    },
    manager: {
      label: isAdded ? "Добавлено" : isInProposal ? "В КП" : "Добавить в КП",
      icon: isAdded ? <Check className="h-4 w-4" /> : <FilePlus className="h-4 w-4" />,
      action: () => kpAdd(product),
      href: "/proposals",
    },
  }[role];

  const size = compact ? "sm" : "md";

  return (
    <Button
      size={size}
      className="gap-2"
      onClick={(event) => {
        event.stopPropagation();
        config.action();
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }}
    >
      {config.icon}
      {config.label}
    </Button>
  );
}
