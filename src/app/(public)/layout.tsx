import { processEnv } from "@/lib/env";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | News Website",
    default: "News Website",
  },
  metadataBase: new URL(processEnv.METADATA_BASE_URL),
  description: "The best news website in the world",
  keywords: ["news", "world", "website"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "News Website",
    description: "The best news website in the world",
    images: "/icon.png",
  },
  manifest: "/manifest.json",
};

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      {children}
      <footer className="py-4 bg-muted text-sm">
        <div className="max-w-screen-2xl mx-auto w-full flex justify-between items-center flex-col-reverse gap-3 sm:flex-row">
          <div className="text-center sm:text-left">
            <h3 className="font-bold">News Website</h3>
            <p>© {new Date().getFullYear()} All rights reserved.</p>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="#">About</Link>
              </li>
              <li>
                <Link href="#">Contact</Link>
              </li>
              <li>
                <Link href="#">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#">Terms of Service</Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default PublicLayout;
