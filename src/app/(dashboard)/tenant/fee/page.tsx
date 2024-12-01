"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CircleCheck, CircleCheckBig } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface Fee {
  amount: number;
  status?: string;
  receiptNo?: string;
  created_date?: string;
  modified_date?: string;
  dueDate?: string;
}

export default function FeeManagementPage() {
  const [pendingFeesPage, setPendingFeesPage] = useState(1);
  const [paymentHistoryPage, setPaymentHistoryPage] = useState(1);
  const itemsPerPage = 5;
  const { data: session } = useSession();
  const userId = session?.user?.user_id;

  const {
    data: feeList,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Fee[]>({
    queryKey: ["feeList"],
    queryFn: async () => {
      const response = await fetch(`/api/rental-fee`, {
        method: "GET",
        headers: {
          "User-Id": userId ? String(userId) : "",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch fees");
      }
      const json = await response.json();
      return json.feeList.map((fee: Fee) => ({
        ...fee,
      }));
    },
  });

  const pendingFees = useMemo(() => {
    return feeList?.filter((fee) => fee.status === "pending") || [];
  }, [feeList]);

  const paymentHistory = useMemo(() => {
    return feeList?.filter((fee) => fee.status === "paid") || [];
  }, [feeList]);

  const getPaginatedItems = (items: Fee[], currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  //function to render pagination for both pending fees and payment history tables
  const renderPagination = (
    totalItems: number,
    currentPage: number,
    setPage: (page: number) => void
  ) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(Math.max(currentPage - 1, 1))}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(Math.min(currentPage + 1, totalPages))}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const [selectedPendingFee, setSelectedPendingFee] = useState<Fee | null>(
    null
  );
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  //function to handle selected pending fee for payment
  const handlePayment = (fee: Fee) => {
    setSelectedPendingFee(fee);
    setShowPaymentSuccess(true);
  };

  return (
    <div>
      <div className="bg-green-100 w-screen h-screen py-16">
        <div className="items-start justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold text-green-900 mb-4">
              Fee Management
            </h1>
          </div>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending Fees</TabsTrigger>
              <TabsTrigger value="history">Payment History</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-2">
                    <Clock className="h-7 w-7 text-green-600" />
                    <span className="text-2xl font-bold text-green-700">
                      Pending Fees
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedItems(pendingFees, pendingFeesPage).map(
                        (fee, index) => (
                          <TableRow key={index}>
                            <TableCell>{fee.dueDate}</TableCell>
                            <TableCell>${fee.amount}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">
                                {fee.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                className="bg-green-700 hover:bg-green-800"
                                onClick={() => handlePayment(fee)}
                              >
                                Pay Now
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                  <div className="mt-4">
                    {renderPagination(
                      pendingFees.length,
                      pendingFeesPage,
                      setPendingFeesPage
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-2">
                    <CircleCheck className="h-7 w-7 text-green-600" />
                    <span className="text-2xl font-bold text-green-700">
                      Payment History
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Paid On</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Receipt No.</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedItems(
                        paymentHistory,
                        paymentHistoryPage
                      ).map((fee, index) => (
                        <TableRow key={index}>
                          <TableCell>{fee.modified_date}</TableCell>
                          <TableCell>${fee.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4">
                    {renderPagination(
                      paymentHistory.length,
                      paymentHistoryPage,
                      setPaymentHistoryPage
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedPendingFee && (
        <Dialog open={showPaymentSuccess} onOpenChange={setShowPaymentSuccess}>
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                <CircleCheckBig className="h-10 w-10 text-green-600" />
              </div>
              <DialogHeader className="mb-8">
                <DialogTitle className="text-2xl font-bold">
                  Payment Successful!
                </DialogTitle>
              </DialogHeader>
              <div className="mb-6 w-full space-y-4 text-left">
                <div className="flex justify-between border-b pb-2"></div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-medium">
                    ${Number(selectedPendingFee.amount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">
                    {new Date().toDateString()}
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
