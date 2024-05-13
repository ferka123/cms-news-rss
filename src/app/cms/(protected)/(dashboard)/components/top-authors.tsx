import type { TopAuthors } from "@/lib/dashboard/queries";
import { CircleUser } from "lucide-react";
import Image from "next/image";

export function TopAuthors({ data }: { data: TopAuthors }) {
  return (
    <div className="space-y-4">
      {data.map((author) => (
        <div key={author.authorId} className="flex items-center gap-2">
          {author.image ? (
            <Image
              className="object-cover rounded-full w-[30px] h-[30px]"
              src={author.image}
              alt={author.name}
              width={30}
              height={30}
            />
          ) : (
            <CircleUser strokeWidth={1} size={30} />
          )}
          <p className="text-sm font-medium leading-none">{author.name}</p>
          <div className="ml-auto font-medium">{author.total}</div>
        </div>
      ))}
    </div>
  );
}
