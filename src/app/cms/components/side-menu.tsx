"use client";

import { Bolt } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavItem, navItems } from "./menu-data";
import type { UserRole } from "@prisma/client";

export const SideMenu = ({ role }: { role: UserRole }) => {
  const pathname = usePathname();
  return (
    <TooltipProvider>
      <div className="w-14 flex-shrink-0 hidden sm:block" />
      <aside className="fixed inset-y-0 z-10 hidden w-14 flex-col border bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground">
            <Bolt className="h-5 w-5" />
          </div>
          {navItems
            .filter((item) => item.roles.includes(role))
            .map((item) => (
              <MenuItem
                key={item.href}
                item={item}
                active={
                  item.href === "/cms"
                    ? pathname === item.href
                    : pathname.startsWith(item.href)
                }
              />
            ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
};

const MenuItem: React.FC<{ item: NavItem; active: boolean }> = ({
  item,
  active,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
            active && "bg-accent"
          )}
        >
          {item.icon}
          <span className="sr-only">{item.title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{item.title}</TooltipContent>
    </Tooltip>
  );
};
