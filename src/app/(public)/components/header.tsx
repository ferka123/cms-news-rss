import { Rss } from "lucide-react";
import Link from "next/link";

export const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className="py-3 bg-muted">
      <div className="max-w-screen-2xl mx-auto w-full flex gap-8 items-start px-2">
        <Link href={"/"} className="flex gap-2 items-center">
          <Rss size={44} className="text-primary" />
          <h1 className="text-xl">News Website</h1>
        </Link>
        {children}
      </div>
    </header>
  );
};
