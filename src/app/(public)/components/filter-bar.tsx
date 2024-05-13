"use client";

import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/composed/combobox";
import { tagLoader } from "@/lib/common/option-loaders";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

const FilterBar = ({
  defaultValue,
}: {
  defaultValue?: { label: string; value: number } | null;
}) => {
  const router = useRouter();
  const [tag, setTag] = useState(defaultValue);

  const setUrl = useCallback(
    () => router.push(tag?.value ? `/filter?tag=${tag?.value}` : "/filter"),
    [tag]
  );

  useEffect(() => {
    setUrl();
  }, [setUrl]);

  return (
    <form action={"filter"} className="flex gap-2 flex-1">
      <div className="flex-1 flex flex-col items-end">
        <Combobox
          value={tag}
          onChange={setTag}
          placeholder="Search by tag..."
          className="hover:bg-background"
          loader={tagLoader}
        />
        <Link href={"/search"}>
          <Button className="p-0 h-auto" variant={"link"}>
            Search by Text
          </Button>
        </Link>
      </div>
      <Button onClick={setUrl} type="button" className="sm:w-20">
        <SearchIcon size={20} className="sm:hidden" />
        <span className="hidden sm:inline">Filter</span>
      </Button>
    </form>
  );
};

export default FilterBar;
