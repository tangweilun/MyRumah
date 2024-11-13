"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CircleCheck } from "lucide-react";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

interface Fee {
  property: string;
  dueDate?: string;
  paidOn?: string;
  amount: number;
  status?: string;
  receiptNo?: string;
}

export default function FeeManagementPage() {
  // const [sorting, setSorting] = React.useState<SortingState>([]);
  // const [colFilters, setColFilters] = React.useState<ColumnFiltersState>([]);
  // const [colVisibility, setColVisibility] = React.useState<VisibilityState>({});
  // const [rowSelection, setRowSelection] = React.useState({});

  const pendingFees: Fee[] = [
    {
      property: "Cozy Downtown Apartment",
      dueDate: "1/15/2024",
      amount: 1200,
      status: "Pending",
    },
    {
      property: "Cozy Downtown Apartment",
      dueDate: "1/15/2024",
      amount: 1200,
      status: "Pending",
    },
    {
      property: "Cozy Downtown Apartment",
      dueDate: "1/15/2024",
      amount: 1200,
      status: "Pending",
    },
    {
      property: "Cozy Downtown Apartment",
      dueDate: "1/15/2024",
      amount: 1200,
      status: "Pending",
    },
    {
      property: "Cozy Downtown Apartment",
      dueDate: "1/15/2024",
      amount: 1200,
      status: "Pending",
    },
    {
      property: "Cozy Downtown Apartment",
      dueDate: "1/15/2024",
      amount: 1200,
      status: "Pending",
    },
  ];

  const paymentHistory: Fee[] = [
    {
      property: "Cozy Downtown Apartment",
      paidOn: "12/15/2024",
      amount: 1200,
      receiptNo: "RCP-2023-001",
    },
    {
      property: "Cozy Downtown Apartment",
      paidOn: "12/15/2024",
      amount: 1200,
      receiptNo: "RCP-2023-001",
    },
    {
      property: "Cozy Downtown Apartment",
      paidOn: "12/15/2024",
      amount: 1200,
      receiptNo: "RCP-2023-001",
    },
    {
      property: "Cozy Downtown Apartment",
      paidOn: "12/15/2024",
      amount: 1200,
      receiptNo: "RCP-2023-001",
    },
    {
      property: "Cozy Downtown Apartment",
      paidOn: "12/15/2024",
      amount: 1200,
      receiptNo: "RCP-2023-001",
    },
    {
      property: "Cozy Downtown Apartment",
      paidOn: "12/15/2024",
      amount: 1200,
      receiptNo: "RCP-2023-001",
    },
  ];

  const [pendingFeesPage, setPendingFeesPage] = useState(1);
  const [paymentHistoryPage, setPaymentHistoryPage] = useState(1);
  const itemsPerPage = 5;

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
              href="#"
              onClick={() => setPage(Math.max(currentPage - 1, 1))}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                //href="#"
                onClick={() => setPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
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

  // const pendingFeesTotalPages = Math.ceil(pendingFees.length / itemsPerPage);
  // const paymentHistoryTotalPages = Math.ceil(
  //   paymentHistory.length / itemsPerPage
  // );
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const showingPendingFees = pendingFees.slice(startIndex, endIndex);
  // const showingPaymentHistory = paymentHistory.slice(startIndex, endIndex);

  // const cols: ColumnDef<PendingFee>[] = [
  //   {
  //     accessorKey: "property",
  //     header: "Property",
  //     cell: ({ row }) => <div className="font-medium">{row.getValue("property")}</div>
  //   },
  //   {
  //     accessorKey: "dueDate",
  //     header: "Due Date"
  //   },
  //   {
  //     accessorKey: "amount",
  //     header: "Amount",
  //     cell: ({ row }) => <div>${row.getValue("amount")}</div>
  //   },
  //   {
  //     accessorKey: "status",
  //     header: "Status",
  //     cell: ({ row }) => <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">{row.getValue("status")}</span>
  //   },
  //   {
  //     id: "actions",
  //     cell: () => <Button className="bg-green-700 hover:bg-green-800">Pay Now</Button>
  //   }
  // ]

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
                        <TableHead>Property</TableHead>
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
                            <TableCell className="font-medium">
                              {fee.property}
                            </TableCell>
                            <TableCell>{fee.dueDate}</TableCell>
                            <TableCell>${fee.amount}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">
                                {fee.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button className="bg-green-700 hover:bg-green-800">
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
                          <TableCell className="font-medium">
                            {fee.property}
                          </TableCell>
                          <TableCell>{fee.paidOn}</TableCell>
                          <TableCell>${fee.amount}</TableCell>
                          <TableCell>{fee.receiptNo}</TableCell>
                          <TableCell className="text-right">
                            <Button className="bg-green-700 hover:bg-green-800">
                              View Receipt
                            </Button>
                          </TableCell>
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
    </div>
  );
}
