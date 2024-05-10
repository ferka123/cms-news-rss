"use client";

import { signOut } from "@/auth";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth/actions";
import React from "react";

const LogoutMenuItem = () => {
  return <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>;
};

export default LogoutMenuItem;
