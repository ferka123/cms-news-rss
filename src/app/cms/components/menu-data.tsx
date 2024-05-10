import type { UserRole } from "@prisma/client";
import { Bolt, Gem, Home, Newspaper, Rss, Users2 } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/cms",
    icon: <Home className="h-5 w-5" />,
    roles: ["admin", "author"],
  },
  {
    title: "News",
    href: "/cms/news",
    icon: <Newspaper className="h-5 w-5" />,
    roles: ["admin", "author"],
  },
  {
    title: "Rss",
    href: "/cms/rss",
    icon: <Rss className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Promos",
    href: "/cms/promos",
    icon: <Gem className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Users",
    href: "/cms/users",
    icon: <Users2 className="h-5 w-5" />,
    roles: ["admin"],
  },
];
