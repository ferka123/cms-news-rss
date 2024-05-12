import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "CMS Portal - Login",
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

const CmsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full items-center justify-center">{children}</div>
  );
};

export default CmsLayout;
