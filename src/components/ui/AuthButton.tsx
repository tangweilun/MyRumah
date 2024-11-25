"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { Button } from "./button";

interface AuthButtonProps {
  href: string;
  children: React.ReactNode;
}

const AuthButton: React.FC<AuthButtonProps> = ({ href, children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleClick = () => {
    setIsLoading(true);
    router.push(href);
  };

  return (
    <Button
      variant="ghost"
      className="text-stone-600 hover:text-green-700"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-green-700 rounded-full animate-spin"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default AuthButton;
