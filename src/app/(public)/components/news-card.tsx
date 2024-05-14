import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dateFormatter } from "@/lib/helpers/date-formatter";
import type { BaseCard, NewsCard } from "@/lib/public/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function NewsCard({ card }: { card: NewsCard & BaseCard }) {
  return (
    <Card
      className={cn(
        card.isPromotion && "border-primary border-2",
        "flex flex-col"
      )}
    >
      <div className="flex flex-col sm:flex-row relative flex-1">
        {card.isPromotion && (
          <Badge className="absolute top-0 right-[-1px] rounded-md z-10">
            Sponsored
          </Badge>
        )}
        {card.image && (
          <div className="w-full h-[200px] sm:w-[200px] flex-shrink-0 relative sm:mt-4 sm:ml-4">
            <Image
              className="rounded-md object-cover"
              src={card.image.src}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              alt={card.title}
            />
          </div>
        )}
        <CardHeader className="flex items-start gap-4">
          <div>
            <CardTitle>{card.title}</CardTitle>
            {card.author && (
              <p className="text-sm text-muted-foreground">By {card.author}</p>
            )}
          </div>
          <CardDescription>{card.description}</CardDescription>
          <div className="flex flex-wrap gap-1">
            {card.tags.slice(0, 4).map((tag) => (
              <Link href={`/filter?tag=${tag.id}`} key={tag.id}>
                <Badge variant={"secondary"}>{tag.name}</Badge>
              </Link>
            ))}
          </div>
        </CardHeader>
      </div>
      <CardFooter>
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <div>{dateFormatter.format(card.pub_date)}</div>
          {card.href && (
            <Link href={card.href} target="_blank">
              <Button variant={"link"}>
                {card.imported_from
                  ? `Read more on ${card.imported_from}`
                  : "Read more"}
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
