import React, { useEffect } from "react";
import { Home } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { handleSignOut } from "@/app/actions/authActions";

import { getSession } from "@/lib/getSession";
import AuthButton from "./AuthButton";
import { NavLink } from "./NavLink";

const Navbar = async () => {
  const session = await getSession();
  return (
    <div className="flex items-center justify-between h-16 px-16 bg-transparent">
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center">
        <Home className="h-8 w-auto text-green-700" />
        <span className="ml-2 text-xl font-semibold text-green-900">
          MyRumah
        </span>
      </div>

      {/* Navigation for medium and larger screens */}
      <nav className="hidden md:flex items-center gap-2 space-x-4">
        {/* Dynamic Links based on role */}
        {session?.user?.role === "owner" && (
          <div className="flex items-center gap-4">
            <NavLink href="/owner">Dashboard</NavLink>
            <NavLink href="/owner/proposal">My Proposals</NavLink>
            <NavLink href="/owner/my-tenant">My Tenants</NavLink>
          </div>
        )}
        {session?.user?.role === "tenant" && (
          <div className="flex items-center gap-4">
            <NavLink href="/tenant">View Properties</NavLink>
            <NavLink href="/tenant/proposal">My Proposals</NavLink>
            <NavLink href="/tenant/fee">Manage Fee</NavLink>
          </div>
        )}

        <div className="flex items-center gap-6">
          {!session ? (
            <>
              <AuthButton href="/auth/sign-in">Login</AuthButton>
              <AuthButton href="/auth/sign-up">Create Account</AuthButton>
            </>
          ) : (
            <form action={handleSignOut}>
              <Button variant="default" type="submit">
                Sign Out
              </Button>
            </form>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
