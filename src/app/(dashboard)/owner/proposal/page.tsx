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
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type Proposal = {
  proposal_id: number;
  property_id: number;
  status: string;
  created_date: string;
  modified_date: string;
  property: Property;
  agreements: Agreement[];
  tenant: Tenant;
  description: string;
  rental_fee: number;
  agreement_status: string;
};

type Property = {
  description: string;
  rental_fee: number;
};

type Agreement = {
  agreement_id: number;
  proposal_id: number;
  agreement_status: string;
  content: string;
  tenant_signature: boolean;
  owner_signature: boolean;
};

type Tenant = {
  tenantName: string;
  tenantEmail: string;
  tenantPhoneNumber: string;
};

export default function OwnerProposalPage() {
  const { data: session } = useSession();
  const userId = session?.user.user_id;
  const userRole = session?.user.role;
  const {
    data: proposal,
    isLoading,
    isError,
  } = useQuery<Proposal[]>({
    queryKey: ["proposals"],
    queryFn: async () => {
      const response = await fetch(`/api/proposals`, {
        method: "GET",
        headers: {
          "User-Id": userId ? userId.toString() : "",
        },
      });

      const json = await response.json();
      return json.proposalList.map((proposal: Proposal) => ({
        proposal_id: proposal.proposal_id,
        property_id: proposal.property_id,
        status: proposal.status,
        created_date: proposal.created_date,
        modified_date: proposal.modified_date,
        description: proposal.property?.description,
        rental_fee: proposal.property?.rental_fee,
        //tenantName: proposal.tenant.tenantName,
        agreements: proposal.agreements.map((agreement) => ({
          agreement_id: agreement.agreement_id,
          agreement_status: agreement.agreement_status,
          content: agreement.content,
          tenant_signature: agreement.tenant_signature,
          owner_signature: agreement.owner_signature,
        })),
      }));
    },
  });

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

  if (isError) {
    console.log("error");
    // return <PropertyError message={"Something went wrong"} />;
  } else {
    console.log("success" + JSON.stringify(proposal));
  }

  if (!proposal?.length) {
    // return <EmptyProposalList />;
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-MY", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }

  const approveProposal = async (proposalId: number) => {
    try {
      const response = await fetch(`/api/agreement/${proposalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "User-Id": userId ? userId.toString() : "",
        },
        body: JSON.stringify({
          status: "approved",
        }),
      });

      setApprovedProposal(true);
    } catch (error) {
      console.error("Error while signing the agreement.");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const paginatedProposals = proposal
    ? getPaginatedItems(proposal, currentPage)
    : [];

  const [approvedProposal, setApprovedProposal] = useState(false);

  const isProposalApproved = (proposalStatus: String) => {
    setApprovedProposal(proposalStatus === "approved");
  };

  const [showProposalDetails, setShowProposalDetails] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal>();

  const viewProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowProposalDetails(true);
  };

  const viewAgreement = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowAgreement(true);
    setOwnerSignedAgreement(proposal.agreements[0].owner_signature);
    setTenantSignedAgreement(proposal.agreements[0].tenant_signature);
  };

  const [ownerSignedAgreement, setOwnerSignedAgreement] = useState(false);
  const [tenantSignedAgreement, setTenantSignedAgreement] = useState(false);

  const tenantSignAgreement = async (agreementId: number) => {
    try {
      const response = await fetch(`/api/agreement/${agreementId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sign",
          userType: userRole,
        }),
      });

      setTenantSignedAgreement(true);
    } catch (error) {
      console.error("Error while signing the agreement.");
    }
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
              My Proposals
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
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProposals.map((proposal) => (
                    <TableRow key={proposal.proposal_id} className="h-12">
                      <TableCell className="font-medium">
                        {proposal.description}
                      </TableCell>
                      <TableCell>{formatDate(proposal.created_date)}</TableCell>
                      <TableCell>{proposal.status}</TableCell>
                      <TableCell>RM {proposal.rental_fee}</TableCell>
                      <TableCell>
                        {proposal.agreements.length > 0 && (
                          <Button
                            variant="outline"
                            size="default"
                            className="shadow"
                            onClick={() => {
                              viewAgreement(proposal);
                            }}
                          >
                            View Agreement
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        {proposal.agreements.length > 0 &&
                          proposal.agreements[0].agreement_status}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="default"
                          className="shadow"
                          onClick={() => viewProposal(proposal)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="default"
                          className="bg-green-700 hover:bg-green-800 text-white shadow"
                        >
                          <Check className="h-2 w-2 mr-1" />
                          <span className="">Approve</span>
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
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold text-green-700 mb-4">
                Agreement Terms
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Term of Agreement</h4>
                  <p className="text-gray-600">
                    {selectedProposal?.agreements[0]?.content}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. Property Details</h4>
                  <p className="text-gray-600">
                    {selectedProposal?.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    3. Rent and Payment Terms
                  </h4>
                  <p className="text-gray-600">
                    Monthly rent amount: {selectedProposal?.rental_fee}
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
                  <span className="font-semibold">$0</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">First Month's Rental</span>
                  <span className="font-semibold">$0</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold">Total Due</span>
                  <span className="font-bold text-lg">$0</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold text-green-700 mb-4">
                Signature
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Owner Signature</span>
                    {ownerSignedAgreement ? (
                      <div className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-sm">Signed by Owner</span>
                      </div>
                    ) : userRole === "owner" ? (
                      // <Button variant="outline" size="sm" onClick={ownerSign}>
                      //   Sign as Owner
                      // </Button>
                      <div></div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Tenant Signature</span>
                    {ownerSignedAgreement ? (
                      tenantSignedAgreement ? (
                        <div className="flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-1" />
                          <span className="text-sm">Signed by Tenant</span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const agreementId =
                              selectedProposal?.agreements[0]?.agreement_id;
                            if (agreementId !== undefined) {
                              tenantSignAgreement(agreementId);
                            }
                          }}
                        >
                          Sign as Tenant
                        </Button>
                      )
                    ) : (
                      <div className="flex items-center text-red-600">
                        <span className="text-xs">
                          Wait Owner to Sign First
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="justify-end space-x-3">
            <Button
              className="bg-green-700 hover:bg-green-800"
              onClick={agreementConfirmation}
              disabled={!ownerSignedAgreement || !tenantSignedAgreement}
            >
              Comfirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showProposalDetails} onOpenChange={setShowProposalDetails}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader className="relative mt-4">
            <DialogTitle className="text-xl font-bold text-green-700 mb-4 ml-3">
              Proposal Details
            </DialogTitle>
            <Badge
              variant="secondary"
              className={`absolute top-0 right-0 ${
                selectedProposal?.status === "approved"
                  ? "bg-green-50 text-green-700"
                  : selectedProposal?.status === "pending"
                  ? "bg-yellow-50 text-yellow-700"
                  : selectedProposal?.status === "rejected"
                  ? "bg-red-50 text-red-700"
                  : selectedProposal?.status === "cancelled"
                  ? "bg-gray-50 text-gray-700"
                  : ""
              }`}
            >
              {selectedProposal?.status}
            </Badge>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tenant Information</h3>
              <div className="gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold"></h4>
                </div>
              </div>
            </div>
          </div>
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
