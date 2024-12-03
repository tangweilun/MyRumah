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
import { BanknoteIcon as Bank } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: string;
}

type WithdrawParams = {
  userId: Number;
  walletAmount: String;
};

export async function withdrawWallet({ userId, walletAmount }: WithdrawParams) {
  const response = await fetch(`/api/wallet/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      walletAmount: walletAmount,
      walletAction: "deduct",
    }),
  });
  return response.json();
}

export function useWithdraw(
  setIsWithdrawLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: withdrawWallet,
    onMutate: () => {
      setIsWithdrawLoading(true); // Set loading to true when mutation starts
    },
    onSuccess: (data) => {
      // Invalidate and refetch properties list
      if (data.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["topUp"] });
        queryClient.invalidateQueries({ queryKey: ["wallet"] });
        toast.success(
          "Your withdrawal was successful! Your amount will take 3 business days to process."
        );
      } else {
        toast.error("Failed to withdraw. Please try again.");
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to withdraw. Please try again.");
      setIsWithdrawLoading(false);
    },
  });
}

export function WithdrawModal({
  isOpen,
  onClose,
  balance,
}: WithdrawModalProps) {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const session = useSession();
  const userId = session?.data?.user.user_id;
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  // Initialize the mutation
  const withdrawMutation = useWithdraw(setIsWithdrawLoading);
  const handleWithdraw = async () => {
    // Implement withdraw logic here
    console.log(`Withdrawing ${withdrawAmount} to account ${bankAccount}`);
    if (userId && withdrawAmount) {
      await withdrawMutation.mutateAsync({
        userId,
        walletAmount: withdrawAmount,
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-700">
            Withdraw Funds
          </DialogTitle>
          <DialogDescription>
            Enter the amount you wish to withdraw and your bank account details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Available Balance:</span>
            <span className="text-2xl font-bold text-green-600">{balance}</span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="withdraw">Withdraw Amount</Label>
            <Input
              id="withdraw"
              type="number"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bankAccount">Bank Account Number</Label>
            <Input
              id="bankAccount"
              type="text"
              placeholder="Enter your bank account number"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleWithdraw}
            disabled={!withdrawAmount || !bankAccount}
          >
            <Bank className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
