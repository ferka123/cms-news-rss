import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUser } from "lucide-react";
import React from "react";
import { auth } from "@/auth";
import LogoutMenuItem from "../components/logout-button";
import Image from "next/image";
import { SideMenu } from "../components/side-menu";
import { BreadCrumbs } from "../components/breadcrumbs";
import { MobileMenu } from "../components/mobile-menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS Portal",
  description: "CMS Portal of the best news website in the world",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    noimageindex: true,
    nosnippet: true,
    googleBot: {
      index: false,
      follow: false,
      nocache: true,
      noarchive: true,
      noimageindex: true,
      nosnippet: true,
    },
  },
};

const CmsLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  const role = session?.user?.role ?? "author";
  return (
    <div className="flex-1 max-w-screen-2xl mx-auto w-full h-full flex md:px-2">
      <SideMenu role={role} />
      <div className="flex-1 flex flex-col w-[calc(100%-3.5rem)]">
        <header className="bg-muted/40 flex justify-between h-14 items-center gap-4 border-b p-4 sm:static sm:h-auto sm:border-0 ">
          <MobileMenu role={role} />
          <BreadCrumbs />
          {session && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="overflow-hidden rounded-full w-11 h-11 p-0"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      width={44}
                      height={44}
                      alt="Avatar"
                    />
                  ) : (
                    <CircleUser strokeWidth={1} size={44} />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <LogoutMenuItem />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </header>
        <div className="flex-1 w-full">{children}</div>
      </div>
    </div>
  );
};

export default CmsLayout;
