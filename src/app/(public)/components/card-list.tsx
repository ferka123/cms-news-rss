import type { ContentCard } from "@/lib/public/types";
import { NewsCard } from "./news-card";
import { ImageCard } from "./image-card";
import { TextCard } from "./text-card";

export function CardList({ cards }: { cards: ContentCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2 self-start">
      {cards.map((card) => {
        switch (card.type) {
          case "news":
            return <NewsCard key={card.card_id} card={card} />;
          case "image":
            return <ImageCard key={card.card_id} card={card} />;
          case "text":
            return <TextCard key={card.card_id} card={card} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
