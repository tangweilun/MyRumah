'use client';
import { Menu, Home, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { role } from '@/lib/data'; // Import the role

const Navbar = () => {
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
        {role === 'owner' && (
          <>
            <Link
              href={'/owner'}
              className="text-stone-600 hover:text-green-700"
            >
              Dashboard
            </Link>
            <Link
              href={'/my-proposals'}
              className="text-stone-600 hover:text-green-700"
            >
              My Proposals
            </Link>
            <Link
              href={'/my-tenants'}
              className="text-stone-600 hover:text-green-700"
            >
              My Tenants
            </Link>
          </>
        )}
        {role === 'tenant' && (
          <>
            <Link
              href={'/my-proposals'}
              className="text-stone-600 hover:text-green-700"
            >
              My Proposals
            </Link>
            <Link
              href={'/wishlist'}
              className="text-stone-600 hover:text-green-700"
            >
              Wishlist
            </Link>
          </>
        )}
      </nav>

      {/* User menu and responsive menu icon */}
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          className="text-white hover:text-green-700 hidden md:block bg-green-700"
          asChild
        >
          Get Started
        </Button>

        {/* Menu icon for small screens */}
        <Button
          variant="outline"
          size="icon"
          className="ml-4 text-green-700 border-green-700 md:hidden"
          asChild
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* User icon for larger screens */}
        <Button
          variant="outline"
          size="icon"
          className="ml-4 text-green-700 border-green-700 hidden md:flex"
          asChild
        >
          <User className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
