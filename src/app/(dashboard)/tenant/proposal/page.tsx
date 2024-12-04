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
import {
  Check,
  X,
  Search,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  DollarSign,
  Clock,
} from "lucide-react";
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
};

type Property = {
  description: string;
  address: string;
  rental_fee: number;
  start_date: string;
  end_date: string;
};

type Agreement = {
  agreement_id: number;
  proposal_id: number;
  agreement_status: string;
  content: string;
  deposit: number;
  init_rental_fee: number;
  tenant_signature: boolean;
  owner_signature: boolean;
  deposit_status: string;
};

type Tenant = {
  user_id: number;
  username: string;
  email: string;
  phone_number: string;
};

export default function TenantProposalPage() {
  const { data: session } = useSession();
  const userId = session?.user.user_id;
  const userRole = session?.user.role;
  const {
    data: proposal,
    isLoading,
    isError,
  } = useQuery<Proposal[]>({
    queryKey: ["tenantProposals"],
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
        property: proposal.property,
        tenant: proposal.tenant,
        agreements: proposal.agreements.map((agreement) => ({
          agreement_id: agreement.agreement_id,
          agreement_status: agreement.agreement_status,
          content: agreement.content,
          deposit: agreement.deposit,
          deposit_status: agreement.deposit_status,
          init_rental_fee: agreement.init_rental_fee,
          tenant_signature: agreement.tenant_signature,
          owner_signature: agreement.owner_signature,
        })),
      }));
    },
  });

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
    console.log("success" + proposal);
  }

  if (!proposal?.length) {
    // return <EmptyProposalList />;
  }

  const [currentPage, setCurrentPage] = useState(1);
  const paginatedProposals = proposal
    ? getPaginatedItems(proposal, currentPage)
    : [];

  const [showProposalDetails, setShowProposalDetails] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal>();
  const [ownerSignedAgreement, setOwnerSignedAgreement] = useState(false);
  const [tenantSignedAgreement, setTenantSignedAgreement] = useState(false);
  const [tenantPaidDeposit, setTenantPaidDeposit] = useState(false);

  const viewProposal = async (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowProposalDetails(true);
  };

  //function to show agreement for selected approved proposal
  const viewAgreement = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowAgreement(true);
    setOwnerSignedAgreement(proposal.agreements[0].owner_signature);
    setTenantSignedAgreement(proposal.agreements[0].tenant_signature);
    setTenantPaidDeposit(proposal.agreements[0].deposit_status === "submitted");
  };

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

      const payFeeResponse = await fetch(`/api/rental-fee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agreementId: agreementId,
        }),
      });

      setTenantSignedAgreement(true);
    } catch (error) {
      console.error("Error occurred while signing the agreement.");
    }
  };

  const tenantPayDeposit = async (agreementId: number) => {
    try {
      const response = await fetch(`/api/deposit/pay-deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agreementId: agreementId,
          userId: userId,
          userRole: userRole,
        }),
      });

      const result = await response.json();

      //change agreement status to "ongoing" after deposit is paid
      if (result.status === 200) {
        try {
          const response = await fetch(`/api/agreement/${agreementId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "approve",
            }),
          });

          window.location.reload();
        } catch (error) {
          console.error("Error while approving the agreement.");
        }
      }
    } catch (error) {
      console.error("Error occurred while paying deposit.");
    }
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
                    <TableHead>Proposal Status</TableHead>
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
                      <TableCell>{formatDate(proposal.created_date)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${
                            proposal.status === "approved"
                              ? "bg-green-50 text-green-700"
                              : proposal.status === "pending"
                              ? "bg-yellow-50 text-yellow-700"
                              : proposal.status === "rejected"
                              ? "bg-red-50 text-red-700"
                              : proposal.status === "cancelled"
                              ? "bg-gray-50 text-gray-700"
                              : ""
                          }`}
                        >
                          {proposal.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>RM {proposal.property.rental_fee}</TableCell>
                      <TableCell>
                        {proposal.agreements.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
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
                        {proposal.agreements.length > 0 && (
                          <Badge
                            variant="secondary"
                            className={`${
                              proposal.agreements[0].agreement_status ===
                              "ongoing"
                                ? "bg-green-50 text-green-700"
                                : proposal.agreements[0].agreement_status ===
                                  "pending"
                                ? "bg-yellow-50 text-yellow-700"
                                : proposal.agreements[0].agreement_status ===
                                  "expired"
                                ? "bg-red-50 text-red-700"
                                : proposal.agreements[0].agreement_status ===
                                  "completed"
                                ? "bg-gray-50 text-gray-700"
                                : ""
                            }`}
                          >
                            {proposal.agreements[0].agreement_status.toUpperCase()}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shadow"
                          onClick={() => viewProposal(proposal)}
                        >
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

      <Dialog open={showProposalDetails} onOpenChange={setShowProposalDetails}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader className="relative mt-4">
            <DialogTitle className="text-2xl font-bold text-green-700 mb-4">
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
              {selectedProposal?.status.toUpperCase()}
            </Badge>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-semibold">Tenant Information</h3>
              <h4 className="font-semibold">
                {selectedProposal?.tenant.username}
              </h4>
              <div className="space-y-1 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{selectedProposal?.tenant.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{selectedProposal?.tenant.phone_number}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-semibold">Property Details</h3>
              <h4 className="font-semibold">
                {selectedProposal?.property.description}
              </h4>
              <div className="space-y-1 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedProposal?.property.address}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-semibold">Lease Terms</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <span>Start Date</span>
                  </div>
                  <span className="text-sm">
                    {formatDate(selectedProposal?.property.start_date || "")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <span>End Date</span>
                  </div>
                  <span className="text-sm">
                    {formatDate(selectedProposal?.property.end_date || "")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>Monthly Rent</span>
                  </div>
                  <span className="text-sm">
                    RM {selectedProposal?.property.rental_fee}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            {selectedProposal?.status === "approved" ? (
              <div className="flex items-center text-green-600">
                <Check className="h-4 w-4 mr-1" />
                <span>Approved</span>
              </div>
            ) : selectedProposal?.status === "rejected" ? (
              <div className="flex items-center text-red-600">
                <X className="h-4 w-4 mr-1" />
                <span>Rejected</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Waiting for Review</span>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                    {selectedProposal?.property.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    3. Rent and Payment Terms
                  </h4>
                  <p className="text-gray-600">
                    Monthly rent amount: RM
                    {selectedProposal?.property.rental_fee}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold text-green-700 mb-4">
                Deposit
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Deposit</span>
                  <span className="font-semibold">
                    RM{selectedProposal?.agreements[0]?.deposit}
                  </span>
                </div>
              </div>

              {tenantPaidDeposit && (
                <div className="mt-4 flex justify-end text-green-600">Paid</div>
              )}
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
                        <div>
                          {" "}
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
                        </div>
                      )
                    ) : (
                      <div>
                        <p className="text-sm text-red-600">
                          Wait Owner to Sign First
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-end">
            {tenantSignedAgreement &&
              (tenantPaidDeposit ? (
                ""
              ) : (
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    const agreementId =
                      selectedProposal?.agreements[0]?.agreement_id;
                    if (agreementId !== undefined) {
                      tenantPayDeposit(agreementId);
                    }
                  }}
                >
                  Pay Deposit
                </Button>
              ))}
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
