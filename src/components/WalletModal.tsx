import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Wallet, ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { WithdrawModal } from "./WithdrawModal";
import { TopUpModal } from "./TopUpModal";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: string;
}

export function WalletModal({ isOpen, onClose, balance }: WalletModalProps) {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-700">
              Your Wallet
            </DialogTitle>
            <DialogDescription>
              View your balance, top up or withdraw from your account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Current Balance:</span>
              <span className="text-2xl font-bold text-green-600">
                {balance}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                onClick={() => setIsWithdrawModalOpen(true)}
              >
                <ArrowDownIcon className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                onClick={() => setIsTopUpModalOpen(true)}
              >
                <ArrowUpIcon className="mr-2 h-4 w-4" />
                Top Up
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        balance={balance}
      />
      <TopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        balance={balance}
      />
    </>
  );
}
