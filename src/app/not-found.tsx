import Link from "next/link";
import { Button } from "@/components/ui";
import { Layers } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F1ECE4]">
        <Layers className="h-10 w-10 text-[#A66A3F]" />
      </div>
      <h1 className="font-display text-6xl font-semibold text-[#2D251E]">404</h1>
      <h2 className="mt-4 text-2xl font-medium text-[#766A5F]">Страница не найдена</h2>
      <p className="mt-4 max-w-md text-[#766A5F]">
        К сожалению, запрашиваемая страница или товар больше не существует или была перемещена.
      </p>
      <div className="mt-10">
        <Link href="/catalog">
          <Button size="lg">Вернуться в каталог</Button>
        </Link>
      </div>
    </div>
  );
}
