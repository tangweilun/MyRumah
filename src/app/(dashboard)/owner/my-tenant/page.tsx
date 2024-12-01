"use client";

import { getPaginatedItems, PaginationControls } from "@/components/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tenant = {
  username: string;
  email: string;
  phone_number: string;
};

function TenantTableSkeleton() {
  return (
    <Card className="bg-white">
      <CardContent className="py-2">
        <Table>
          <TableHeader>
            <TableRow className="h-12">
              <TableHead className="text-green-900">Tenant Name</TableHead>
              <TableHead className="text-green-900">Tenant Email</TableHead>
              <TableHead className="text-green-900">
                Tenant Contact Number
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(1)].map((_, index) => (
              <TableRow key={index} className="h-12">
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[160px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Skeleton className="h-8 w-[80px]" /> {/* Previous */}
          <Skeleton className="h-8 w-[30px]" /> {/* Page number */}
          <Skeleton className="h-8 w-[80px]" /> {/* Next */}
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-center gap-4">
        {message}
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="ml-auto"
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
}

const MyTenantPage = () => {
  const { data: session } = useSession();
  const userId = session?.user?.user_id;

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: tenantList,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Tenant[]>({
    queryKey: ["tenantList"],
    queryFn: async () => {
      const response = await fetch(`/api/tenant-mgmt`, {
        method: "GET",
        headers: {
          "User-Id": userId ? String(userId) : "",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tenants");
      }
      const json = await response.json();
      return json.tenantList.map((tenant: Tenant) => ({
        ...tenant,
      }));
    },
  });

  const paginatedMyTenant = getPaginatedItems(tenantList || [], currentPage);

  return (
    <div className="bg-green-100 w-screen h-screen py-16">
      <div className="items-start justify-between p-6">
        <h1 className="text-3xl font-bold text-green-900 mb-4">Your Tenants</h1>
        {isLoading ? (
          <TenantTableSkeleton />
        ) : isError ? (
          <ErrorMessage
            message={
              (error as Error).message ||
              "An error occurred while fetching tenants"
            }
            onRetry={() => refetch()}
          />
        ) : tenantList && tenantList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">No tenants found.</p>
            <p className="text-sm text-gray-500">
              You currently don't have any tenants assigned to your account.
            </p>
          </div>
        ) : (
          <Card>
            <CardContent className="py-2">
              <Table>
                <TableHeader>
                  <TableRow className="h-12">
                    <TableHead>Tenant Name</TableHead>
                    <TableHead>Tenant Email</TableHead>
                    <TableHead>Tenant Contact Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMyTenant.map((tenant) => (
                    <TableRow key={tenant.email} className="h-12">
                      <TableCell className="font-medium">
                        {tenant.username}
                      </TableCell>
                      <TableCell>{tenant.email}</TableCell>
                      <TableCell>{tenant.phone_number}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <PaginationControls
                  currentPage={currentPage}
                  totalItems={tenantList?.length || 0}
                  onPageChange={setCurrentPage}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyTenantPage;
