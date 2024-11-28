import React, { useEffect } from "react";
import { Home } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { handleSignOut } from "@/app/actions/authActions";

import { getSession } from "@/lib/getSession";
import AuthButton from "./ui/AuthButton";

const Navbar = async () => {
  const session = await getSession();
  // const router = useRouter();
  console.log("session using server compoment in nav bar:" + session);

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
          <>
            <Link
              href={"/owner"}
              className="text-stone-600 hover:text-green-700"
            >
              Dashboard
            </Link>
            <Link
              href={"/list/my-proposals"}
              className="text-stone-600 hover:text-green-700"
            >
              My Proposals
            </Link>
            <Link
              href={"/list/my-tenants"}
              className="text-stone-600 hover:text-green-700"
            >
              My Tenants
            </Link>
          </>
        )}
        {session?.user?.role === "tenant" && (
          <>
            <Link
              href={"/list/my-proposals"}
              className="text-stone-600 hover:text-green-700"
            >
              My Proposals
            </Link>
            <Link
              href={"/list/wishlist"}
              className="text-stone-600 hover:text-green-700"
            >
              Wishlist
            </Link>
          </>
        )}
        {/* User menu and responsive menu icon */}
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

      {/* {!isLoading && (
          <>
            {!session ? (
              <div className="flex gap-2 justify-center">
                <Link href="/auth/sign-in">
                  <Button
                    variant="default"
                    className='text-stone-600 hover:text-green-700"'
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button
                    variant="default"
                    className='text-stone-600 hover:text-green-700"'
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <form action={handleSignOut}>
                <Button variant="default" type="submit">
                  Sign Out
                </Button>
              </form>
            )}
          </>
        )} */}
    </div>
  );
};

export default Navbar;
