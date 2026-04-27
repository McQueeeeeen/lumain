"use client";

import { useState, type ReactNode } from "react";
import { Check, FilePlus, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui";
import { useCheckoutStore } from "@/store/checkout-store";
import { useDesignerStore } from "@/store/designer-store";
import { useKPStore } from "@/store/kp-store";
import { useViewerStore } from "@/store/viewer-store";
import { Product } from "@/types";

type ActionConfig = {
  label: string;
  icon: ReactNode;
  action: () => void;
};

export function RoleActionButton({ product, compact = false }: { product: Product; compact?: boolean }) {
  const role = useViewerStore((state) => state.role);
  const checkoutItems = useCheckoutStore((state) => state.items);
  const checkoutAdd = useCheckoutStore((state) => state.addItem);
  const designerItems = useDesignerStore((state) => state.items);
  const designerAdd = useDesignerStore((state) => state.addItem);
  const kpItems = useKPStore((state) => state.items);
  const kpAdd = useKPStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const isInCheckout = checkoutItems.some((item) => item.id === product.id);
  const isInDesigner = designerItems.some((item) => item.id === product.id);
  const isInProposal = kpItems.some((item) => item.id === product.id);

  const configs: Record<string, ActionConfig> = {
    client: {
      label: added ? "Добавлено" : isInCheckout ? "Купить еще" : "Купить",
      icon: added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />,
      action: () => checkoutAdd(product),
    },
    designer: {
      label: added ? "Добавлено" : isInDesigner ? "В подборке" : "В дизайнерскую",
      icon: added ? <Check className="h-4 w-4" /> : <Heart className="h-4 w-4" />,
      action: () => designerAdd(product),
    },
    manager: {
      label: added ? "Добавлено" : isInProposal ? "В КП" : "Добавить в КП",
      icon: added ? <Check className="h-4 w-4" /> : <FilePlus className="h-4 w-4" />,
      action: () => kpAdd(product),
    },
    admin: {
      label: added ? "Добавлено" : isInProposal ? "В КП" : "Добавить в КП",
      icon: added ? <Check className="h-4 w-4" /> : <FilePlus className="h-4 w-4" />,
      action: () => kpAdd(product),
    },
  };

  const config = configs[role] || configs.client;

  return (
    <Button
      size={compact ? "sm" : "md"}
      className="gap-2"
      onClick={(event) => {
        event.stopPropagation();
        config.action();
        setAdded(true);
        window.setTimeout(() => setAdded(false), 2000);
      }}
    >
      {config.icon}
      {config.label}
    </Button>
  );
}
