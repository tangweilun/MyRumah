import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CircleCheck } from 'lucide-react';
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
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';

export default function FeeManagementPage() {
  return (
    <div>
      <div className="bg-green-100 w-screen py-16">
        <div className="items-start justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold text-green-900 mb-4">
              Fee Management
            </h1>
          </div>
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-2">
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
                <CardContent></CardContent>
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
                <CardContent></CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
