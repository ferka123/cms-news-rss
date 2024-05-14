import { Search as SearchIcon } from "lucide-react";

export const NoResultsFound = ({ description }: { description: string }) => {
  return (
    <div className="p-6 mt-10 flex-1">
      <div className="flex gap-4">
        <SearchIcon className="mt-1" />
        <div>
          <p className="flex  text-xl">No results found</p>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};
