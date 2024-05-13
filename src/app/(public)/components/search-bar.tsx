import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";

const SearchBar = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <form action={"search"} className="flex gap-2 flex-1">
      <div className="flex-1 flex flex-col items-end">
        <Input {...props} name="q" placeholder="Search by title..." />
        <Link href={"/filter"}>
          <Button type="button" className="p-0 h-auto" variant={"link"}>
            Filter by Tag
          </Button>
        </Link>
      </div>
      <Button className="sm:w-20">
        <SearchIcon size={20} className="sm:hidden" />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  );
};

export default SearchBar;
