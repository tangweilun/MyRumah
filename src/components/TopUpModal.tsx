import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Wallet, CreditCard, BanknoteIcon as Bank } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: string;
}

type TopUpParams = {
  userId: Number;
  walletAmount: String;
};

export async function topUpWallet({ userId, walletAmount }: TopUpParams) {
  const response = await fetch(`/api/wallet/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      walletAmount: walletAmount,
      walletAction: "topup",
    }),
  });
  return response.json();
}

export function useTopUp(
  setIsTopUpLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: topUpWallet,
    onMutate: () => {
      setIsTopUpLoading(true); // Set loading to true when mutation starts
    },
    onSuccess: (data) => {
      // Invalidate and refetch properties list
      if (data.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["topUp"] });
        queryClient.invalidateQueries({ queryKey: ["wallet"] });
        toast.success("Your deposit was successful!");
      } else {
        toast.error("Failed to deposit. Please try again.");
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to deposit. Please try again.");
      setIsTopUpLoading(false);
    },
  });
}

export function TopUpModal({ isOpen, onClose, balance }: TopUpModalProps) {
  const [topUpAmount, setTopUpAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<"card" | "bank" | null>(
    null
  );
  const session = useSession();
  const userId = session?.data?.user.user_id;
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  // Initialize the mutation
  const topUpMutation = useTopUp(setIsTopUpLoading);

  const handleTopUp = async () => {
    // Implement top-up logic here

    console.log(`Topping up ${topUpAmount} using ${selectedMethod}`);
    if (userId && topUpAmount) {
      await topUpMutation.mutateAsync({ userId, walletAmount: topUpAmount });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-700">
            Your Wallet
          </DialogTitle>
          <DialogDescription>
            View your balance and top up your account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Current Balance:</span>
            <span className="text-2xl font-bold text-green-600">{balance}</span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="topup">Top Up Amount</Label>
            <Input
              id="topup"
              type="number"
              placeholder="Enter amount"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Payment Method</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={`flex-1 ${
                  selectedMethod === "card"
                    ? "bg-green-100 text-green-800 border-green-300"
                    : ""
                }`}
                onClick={() => setSelectedMethod("card")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Card
              </Button>
              <Button
                variant="outline"
                className={`flex-1 ${
                  selectedMethod === "bank"
                    ? "bg-green-100 text-green-800 border-green-300"
                    : ""
                }`}
                onClick={() => setSelectedMethod("bank")}
              >
                <Bank className="mr-2 h-4 w-4" />
                Bank
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleTopUp}
            disabled={!topUpAmount || !selectedMethod}
          >
            Top Up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
