"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useTransition } from "react";
import { Loader2 } from "lucide-react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  loadingClassName?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  className = "text-stone-600 hover:text-green-700",
  loadingClassName = "text-stone-400 cursor-not-allowed",
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (pathname !== href) {
      setIsClicked(true);
      startTransition(() => {
        router.push(href);
      });
    }
  };

  // Reset `isClicked` when the navigation completes
  useEffect(() => {
    if (pathname === href) {
      setIsClicked(false);
    }
  }, [pathname, href]);

  const isLoading = isClicked || isPending;

  if (isLoading) {
    return (
      <div
        className={`${loadingClassName} flex items-center gap-2`}
        aria-busy="true"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        {children}
      </div>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};
