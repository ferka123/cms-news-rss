import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { BaseCard, ImageCard } from "@/lib/public/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function ImageCard({ card }: { card: ImageCard & BaseCard }) {
  return (
    <Card
      className={cn(
        card.isPromotion && "border-primary border-2 min-h-[250px]"
      )}
    >
      <div className="w-full h-full relative">
        <Badge className="absolute top-0 right-[-1px] rounded-md z-10">
          Sponsored
        </Badge>
        <ImageLink href={card.href}>
          <Image
            className="rounded-md object-cover"
            src={card.image.src}
            alt={"Image promotion"}
            sizes="(max-width: 640px) 100vw, 50vw"
            fill
          />
        </ImageLink>
      </div>
    </Card>
  );
}

export function ImageLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string | null;
}) {
  if (!href) return children;
  return (
    <Link href={href} target={"_blank"}>
      {children}
    </Link>
  );
}
