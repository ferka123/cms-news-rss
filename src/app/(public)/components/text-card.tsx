import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BaseCard, TextCard } from "@/lib/public/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function TextCard({ card }: { card: TextCard & BaseCard }) {
  return (
    <Card className={cn(card.isPromotion && "border-primary border-2")}>
      <CardContent className="relative p-6">
        <Badge className="absolute top-0 right-[-1px] rounded-md z-10">
          Sponsored
        </Badge>
        <p>{card.text}</p>
        {card.href && (
          <Link href={card.href} target="_blank">
            <Button className="p-0" variant={"link"}>
              {card.href_text ?? "Read more"}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
