import { Badge } from "@/components/ui/badge";
import { cachedGetPopularTags } from "@/lib/tags/queries";
import Link from "next/link";

export async function PopularTags() {
  const tags = await cachedGetPopularTags(20, 7);

  if (!tags) return null;

  return (
    <div className="p-5">
      <h2 className="mb-2 text-xl">Popular this week</h2>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Link href={`/filter?tag=${tag.id}`} key={tag.id}>
            <Badge variant={"secondary"} className="cursor-pointer">
              {tag.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
