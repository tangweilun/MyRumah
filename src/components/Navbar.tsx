'use client';
import React from 'react';
import { Menu, Home, User } from 'lucide-react';
import Link from 'next/link';
import { UserButton, useAuth, useUser } from '@clerk/nextjs'; // Import useAuth

const Navbar = () => {
  const { isSignedIn } = useAuth(); // Check if the user is signed in
  const { user } = useUser();
  const role = user?.publicMetadata.role;
  // console.log('Inside nav bar isSignedIn:' + isSignedIn);
  // console.log('Inside nav bar role:' + role);
  return (
    <div className="flex items-center justify-between h-16 px-16 m-8">
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
        {role === 'owner' && isSignedIn && (
          <>
            <Link
              href={'/owner'}
              className="text-stone-600 hover:text-green-700"
            >
              Dashboard
            </Link>
            <Link
              href={'/list/my-proposals'}
              className="text-stone-600 hover:text-green-700"
            >
              My Proposals
            </Link>
            <Link
              href={'/list/my-tenants'}
              className="text-stone-600 hover:text-green-700"
            >
              My Tenants
            </Link>
          </>
        )}
        {role === 'tenant' && isSignedIn && (
          <>
            <Link
              href={'/list/my-proposals'}
              className="text-stone-600 hover:text-green-700"
            >
              My Proposals
            </Link>
            <Link
              href={'/list/wishlist'}
              className="text-stone-600 hover:text-green-700"
            >
              Wishlist
            </Link>
          </>
        )}
      </nav>

      {/* User menu and responsive menu icon */}
      <div className="flex items-center gap-6">
        {!isSignedIn && (
          <>
            <Link
              href={'/sign-in'}
              className="text-stone-600 hover:text-green-700"
            >
              Login
            </Link>
            <Link
              href={'/sign-up'}
              className="text-stone-600 hover:text-green-700"
            >
              Create Account
            </Link>
          </>
        )}
        <UserButton showName />
      </div>
    </div>
  );
};

export default Navbar;
