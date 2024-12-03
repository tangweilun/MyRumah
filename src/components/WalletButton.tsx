"use client";
import { Plus, Wallet, Loader } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { WalletModal } from "./WalletModal";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Wallet {
  walletAmount: string;
}

export function WalletButton() {
  const { data: session } = useSession();

  const userId = session?.user?.user_id;

  const {
    data: walletBalance,
    isLoading,
    isError,
    error,
  } = useQuery<Wallet>({
    queryKey: ["wallet", userId], // Add userId to queryKey for better caching
    queryFn: async () => {
      if (!userId) {
        throw new Error("No user ID available");
      }

      const response = await fetch(`/api/wallet/${userId}`);
      const json = await response.json();

      // Return the full wallet object instead of just walletAmount
      return {
        walletAmount: json.walletAmount,
      };
    },
    // Add enabled option to prevent query when no userId
    enabled: !!userId,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading wallet balance</div>;
  }

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-green-200 text-green-700 hover:text-green-600 transition-all duration-300 ease-in-out"
        onClick={() => setIsModalOpen(true)}
      >
        <Wallet className="h-5 w-5" />
        <span className="font-medium">
          {walletBalance ? `RM${walletBalance.walletAmount}` : "RM 0.00"}
        </span>
      </Button>
      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        balance={walletBalance ? `${walletBalance.walletAmount}` : "RM 0.00"}
      />
    </>
  );
}
