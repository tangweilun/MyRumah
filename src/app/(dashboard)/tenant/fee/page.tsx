"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Clock, CircleCheck, CircleCheckBig, XCircle } from "lucide-react";

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
  DialogDescription,
} from "@/components/ui/dialog";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSession } from "next-auth/react";

interface Fee {
  fee_id: string;

  amount: number;

  status?: string;

  receiptNo?: string;

  created_date?: string;

  modified_date?: string;

  dueDate?: string;
  agreement_id: string;
}

interface PaymentErrorResponse {
  status: number;

  message: string;
}

interface PaymentResponse {
  status: number;
  message?: string;
  // Add other potential response fields
}

export async function payFee(fee: Fee, userId: any) {
  const response = await fetch(`/api/rental-fee/${fee.fee_id}`, {
    method: "PATCH",
    headers: {
      "User-Id": userId ? String(userId) : "",
    },
  });

  const deposit = await fetch(`/api/deposit/process-deposit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agreementId: fee.agreement_id,
    }),
  });

  const data: PaymentResponse = await response.json();
  const dataDeposit = await deposit.json();
  console.log(dataDeposit);
  // Check if the internal status is not successful
  if (data.status !== 200) {
    throw data;
  }

  return data;
}

export default function FeeManagementPage() {
  const [pendingFeesPage, setPendingFeesPage] = useState(1);

  const [paymentHistoryPage, setPaymentHistoryPage] = useState(1);

  const [selectedPendingFee, setSelectedPendingFee] = useState<Fee | null>(
    null
  );

  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const [showPaymentError, setShowPaymentError] = useState(false);

  const [paymentErrorMessage, setPaymentErrorMessage] = useState("");

  const itemsPerPage = 5;

  const { data: session } = useSession();

  const userId = session?.user?.user_id;

  const queryClient = useQueryClient();

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
      const json = await response.json();

      return json.feeList.map((fee: Fee) => ({
        ...fee,
      }));
    },
  });

  const convertDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const pendingFees = useMemo(() => {
    return feeList?.filter((fee) => fee.status === "pending") || [];
  }, [feeList]);

  const paymentHistory = useMemo(() => {
    return feeList?.filter((fee) => fee.status === "paid") || [];
  }, [feeList]);

  const payFeeMutation = useMutation({
    mutationFn: (fee: Fee) => payFee(fee, userId),

    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["feeList"] });
        setShowPaymentSuccess(true);
        setShowPaymentError(false);
      } else {
        // Treat as an error if internal status is not 200
        throw data;
      }
    },

    onError: (error: PaymentErrorResponse) => {
      setPaymentErrorMessage(error.message);
      setShowPaymentError(true);
      setShowPaymentSuccess(false);
    },
  });

  const getPaginatedItems = (items: Fee[], currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    const endIndex = startIndex + itemsPerPage;

    return items.slice(startIndex, endIndex);
  };

  const handlePayment = (fee: Fee) => {
    setSelectedPendingFee(fee);

    payFeeMutation.mutate(fee);
  };

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
                  {pendingFees.length === 0 ? (
                    <p className="text-center text-gray-500">
                      No pending fees.
                    </p>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Fee Id</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {getPaginatedItems(pendingFees, pendingFeesPage).map(
                            (fee, index) => (
                              <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>RM{fee.amount}</TableCell>
                                <TableCell>
                                  <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">
                                    {fee.status}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    className="bg-green-700 hover:bg-green-800"
                                    onClick={() => handlePayment(fee)}
                                    disabled={payFeeMutation.isPending}
                                  >
                                    {payFeeMutation.isPending
                                      ? "Processing..."
                                      : "Pay Now"}
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
                    </>
                  )}
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
                  {paymentHistory.length === 0 ? (
                    <p className="text-center text-gray-500">
                      No payment history available.
                    </p>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Fee Id</TableHead>
                            <TableHead>Paid On</TableHead>
                            <TableHead>Amount</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {getPaginatedItems(
                            paymentHistory,
                            paymentHistoryPage
                          ).map((fee, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                {convertDate(fee.modified_date)}
                              </TableCell>
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
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* Success Dialog */}
      {selectedPendingFee && showPaymentSuccess && (
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
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-medium">
                    RM{Number(selectedPendingFee.amount).toFixed(2)}
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

      {/* Error Dialog */}
      {selectedPendingFee && showPaymentError && (
        <Dialog open={showPaymentError} onOpenChange={setShowPaymentError}>
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <DialogHeader className="mb-8">
                <DialogTitle className="text-2xl font-bold text-red-700">
                  Payment Failed
                </DialogTitle>
                <DialogDescription className="text-red-500">
                  {paymentErrorMessage}
                </DialogDescription>
              </DialogHeader>
              <div className="mb-6 w-full space-y-4 text-left">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Attempted Amount</span>
                  <span className="font-medium text-red-600">
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
              <Button
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => setShowPaymentError(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
