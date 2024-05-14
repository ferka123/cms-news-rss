"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bolt } from "lucide-react";
import { NavItem, navItems } from "./menu-data";
import Link from "next/link";
import { useState } from "react";
import type { UserRole } from "@prisma/client";

export const MobileMenu = ({ role }: { role: UserRole }) => {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <Bolt className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          {navItems
            .filter((item) => item.roles.includes(role))
            .map((item) => (
              <MenuItem key={item.href} item={item} onClick={closeMenu} />
            ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

const MenuItem: React.FC<{ item: NavItem; onClick: () => void }> = ({
  item,
  onClick,
}) => {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
    >
      {item.icon}
      {item.title}
    </Link>
  );
};
