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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface Proposal {
  proposal_id: number;
  property_id: number;
  status: string;
  created_date: string;
  modified_date: string;
  property: Property;
  agreement: Agreement;
  // amount: number;
  // agreement?: object;
  // agreementStatus: string;
}

interface Property {
  description: string;
}

interface Agreement {
  proposal_id: number;
}

export default function TenantProposalPage() {
  const { data: session } = useSession();
  console.log("Session Data:", session);
  const tenantId = session?.user.user_id;
  const {
    data: proposal,
    isLoading,
    isError,
  } = useQuery<Proposal[]>({
    queryKey: ["proposals"],
    queryFn: async () => {
      const response = await fetch(`/api/proposals`);
      const json = await response.json();
      return json.proposalList.map((proposal: Proposal) => ({
        proposalId: proposal.proposal_id,
        propertyId: proposal.property_id,
        propertyStatus: proposal.status,
        dateCreated: proposal.created_date,
        dateModified: proposal.modified_date,
        description: proposal.property?.description,
      }));
    },
  });

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // if (isLoading) {
  //   return (
  //     <div className="p-8">
  //       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  //         {/* {Array.from({ length: 6 }).map((_, index) => (
  //           <PropertySkeleton key={index} />
  //         ))} */}
  //       </div>
  //     </div>
  //   );
  // }

  // if (isError) {
  //   return <PropertyError message={"Something went wrong"} />;
  // }

  // if (!proposal?.length) {
  //   console.log(proposal);
  //   // return <EmptyProposalList />;
  // }

  // const proposalList: Proposal[] = [
  //   {
  //     property: "Cozy Downtown Apartment",
  //     dateSubmitted: "10/15/2024",
  //     proposalStatus: "Approved",
  //     amount: 1200,
  //     agreementStatus: "Pending",
  //   },
  //   {
  //     property: "Cozy Downtown Apartment",
  //     dateSubmitted: "10/15/2024",
  //     proposalStatus: "Pending",
  //     amount: 1200,
  //     agreementStatus: "Pending",
  //   },
  //   {
  //     property: "Cozy Downtown Apartment",
  //     dateSubmitted: "10/15/2024",
  //     proposalStatus: "Pending",
  //     amount: 1200,
  //     agreementStatus: "Pending",
  //   },
  //   {
  //     property: "Cozy Downtown Apartment",
  //     dateSubmitted: "10/15/2024",
  //     proposalStatus: "Pending",
  //     amount: 1200,
  //     agreementStatus: "Pending",
  //   },
  //   {
  //     property: "Cozy Downtown Apartment",
  //     dateSubmitted: "10/15/2024",
  //     proposalStatus: "Pending",
  //     amount: 1200,
  //     agreementStatus: "Pending",
  //   },
  //   {
  //     property: "Cozy Downtown Apartment",
  //     dateSubmitted: "10/15/2024",
  //     proposalStatus: "Cancelled",
  //     amount: 1200,
  //     agreementStatus: "Pending",
  //   },
  // ];

  const [currentPage, setCurrentPage] = useState(1);
  const paginatedProposals = proposal
    ? getPaginatedItems(proposal, currentPage)
    : [];

  const [showAgreement, setShowAgreement] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );

  //function to show agreement for selected approved proposal
  const viewAgreement = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowAgreement(true);
  };

  const [ownerSigned, setOwnerSigned] = useState(false);
  const [tenantSigned, setTenantSigned] = useState(false);

  const ownerSign = () => {
    setOwnerSigned(true);
  };

  const tenantSign = () => {
    setTenantSigned(true);
  };

  const agreementConfirmation = () => {
    setShowAgreement(false);
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
                  {paginatedProposals.map((proposal) => (
                    <TableRow key={proposal.proposal_id} className="h-12">
                      <TableCell className="font-medium">
                        {proposal.property.description}
                      </TableCell>
                      <TableCell>{proposal.created_date}</TableCell>
                      <TableCell>{proposal.status}</TableCell>
                      {/* <TableCell>
                        {proposal.status === "Approved" && (
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
                      <TableCell>{proposal.agreementStatus}</TableCell> */}
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
                  totalItems={proposal?.length ? proposal?.length : 0}
                  onPageChange={setCurrentPage}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showAgreement} onOpenChange={setShowAgreement}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-700 mb-4 ml-3">
              Rental Agreement
            </DialogTitle>
          </DialogHeader>
          {/* <div className="space-y-6">
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
                    The property located at{" "}
                    {selectedProposal ? selectedProposal.property : ""}.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    3. Rent and Payment Terms
                  </h4>
                  <p className="text-gray-600">
                    Monthly rent amount:{" "}
                    {selectedProposal ? selectedProposal.amount : 0}
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
                    ${selectedProposal ? selectedProposal.amount : 0}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">First Month's Rental</span>
                  <span className="font-semibold">
                    ${selectedProposal ? selectedProposal.amount : 0}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold">Total Due</span>
                  <span className="font-bold text-lg">
                    ${selectedProposal ? selectedProposal.amount * 2 : 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold text-green-700">
                Security Deposit Terms
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Terms and conditions for the security deposit.
              </p>

              <div className="space-y-4">
                <p className="text-gray-600">
                  The security deposit of $
                  {selectedProposal ? selectedProposal.amount : 0} will be held
                  in accordance with state law and will be returned within 30
                  days of lease termination, less any deductions for damages
                  beyond normal wear and tear.
                </p>

                <div>
                  <h4 className="font-semibold mb-2">
                    Potential Deductions Include:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>Unpaid rent or utilities.</li>
                    <li>Damage to the property byeond normal wear and tear.</li>
                    <li>
                      Cleaning costs if property is not left in same condition.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold text-green-700">
                Signature
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Digital signature confirmation
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Owner Signature</span>
                    {ownerSigned ? (
                      <div className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-sm">Signed by Owner</span>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={ownerSign}>
                        Sign as Owner
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Tenant Signature</span>
                    {tenantSigned ? (
                      <div className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-sm">Signed by Tenant</span>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={tenantSign}>
                        Sign as Tenant
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <DialogFooter className="justify-end space-x-3">
            <Button
              className="bg-green-700 hover:bg-green-800"
              onClick={agreementConfirmation}
              disabled={!ownerSigned || !tenantSigned}
            >
              Comfirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const EmptyProposalList = () => {
  <div className="text-center py-12">
    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
      <Search className="h-6 w-6 text-gray-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">
      You Don't Have Any Proposals Yet
    </h3>
  </div>;
};
