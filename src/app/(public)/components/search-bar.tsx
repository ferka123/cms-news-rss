import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const SearchBar = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <form action={"search"} className="flex gap-2 flex-1">
      <div className="flex-1 flex flex-col items-end">
        <Input {...props} name="q" placeholder="Search..." />
        <Link href={"/filter"}>
          <Button type="button" className="p-0 h-auto" variant={"link"}>
            Filter by Tag
          </Button>
        </Link>
      </div>
      <Button className="w-20">Search</Button>
    </form>
  );
};

export default SearchBar;
