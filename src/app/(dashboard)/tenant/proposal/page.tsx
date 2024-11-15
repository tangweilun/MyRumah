"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PaginationControls, getPaginatedItems } from "@/components/Pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Proposal {
  property: string;
  dateSubmitted: string;
  proposalStatus: string;
  amount: number;
  agreement?: object;
  agreementStatus: string;
}

export default function TenantProposalPage() {
  const proposalList: Proposal[] = [
    {
      property: "Cozy Downtown Apartment",
      dateSubmitted: "10/15/2024",
      proposalStatus: "Approved",
      amount: 1200,
      agreementStatus: "Pending",
    },
    {
      property: "Cozy Downtown Apartment",
      dateSubmitted: "10/15/2024",
      proposalStatus: "Pending",
      amount: 1200,
      agreementStatus: "Pending",
    },
    {
      property: "Cozy Downtown Apartment",
      dateSubmitted: "10/15/2024",
      proposalStatus: "Pending",
      amount: 1200,
      agreementStatus: "Pending",
    },
    {
      property: "Cozy Downtown Apartment",
      dateSubmitted: "10/15/2024",
      proposalStatus: "Pending",
      amount: 1200,
      agreementStatus: "Pending",
    },
    {
      property: "Cozy Downtown Apartment",
      dateSubmitted: "10/15/2024",
      proposalStatus: "Pending",
      amount: 1200,
      agreementStatus: "Pending",
    },
    {
      property: "Cozy Downtown Apartment",
      dateSubmitted: "10/15/2024",
      proposalStatus: "Cancelled",
      amount: 1200,
      agreementStatus: "Pending",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const paginatedProposals = getPaginatedItems(proposalList, currentPage);

  const [showAgreement, setShowAgreement] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );

  //function to show agreement for selected approved proposal
  const viewAgreement = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowAgreement(true);
  };

  return (
    <div>
      <div className="bg-green-100 w-screen h-screen py-16">
        <div className="items-start justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold text-green-900 mb-4">
              Your Proposals
            </h1>
          </div>
          <Card>
            <CardContent className="py-2">
              <Table>
                <TableHeader>
                  <TableRow className="h-12">
                    <TableHead>Property</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Agreement</TableHead>
                    <TableHead>Agreement Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProposals.map((proposal, index) => (
                    <TableRow key={index} className="h-12">
                      <TableCell className="font-medium">
                        {proposal.property}
                      </TableCell>
                      <TableCell>{proposal.dateSubmitted}</TableCell>
                      <TableCell>{proposal.proposalStatus}</TableCell>
                      <TableCell>${proposal.amount}/month</TableCell>
                      <TableCell>
                        {proposal.proposalStatus === "Approved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="shadow"
                            onClick={() => viewAgreement(proposal)}
                          >
                            View Agreement
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>{proposal.agreementStatus}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="shadow">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <PaginationControls
                  currentPage={currentPage}
                  totalItems={proposalList.length}
                  onPageChange={setCurrentPage}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showAgreement} onOpenChange={setShowAgreement}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-700 mb-4 ml-3">
              Rental Agreement
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold text-green-700 mb-4">
                Agreement Terms
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Term of Agreement</h4>
                  <p className="text-gray-600">
                    This rental agreement is entered into on [Date] between
                    [Owner Name] and [Tenant Name].
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. Property Details</h4>
                  <p className="text-gray-600">
                    The property located at {selectedProposal?.property}...
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    3. Rent and Payment Terms
                  </h4>
                  <p className="text-gray-600">
                    Monthly rent amount: {selectedProposal?.amount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold text-green-700 mb-4">
                Initial Fee Payment
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Deposit</span>
                  <span className="font-semibold">
                    ${selectedProposal?.amount}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">First Month's Rental</span>
                  <span className="font-semibold">
                    ${selectedProposal?.amount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
