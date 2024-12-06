"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

import {
  Edit2,
  Eye,
  Trash2,
  Bed,
  DollarSign,
  MapPin,
  Calendar,
  Clock,
  Loader,
} from "lucide-react";
import Image from "next/image";
import PropertyGallery from "@/components/PhotoGallery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Previous property details content remains the same
const proposals = [
  {
    id: 1,
    name: "Alice Johnson",
    property: "Sunset Apartments, Unit 301",
    duration: "12 months",
    rate: "$1,500/month",
    submitted: "Submitted 2 days ago",
    status: "Pending",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Bob Smith",
    property: "Oakwood Residences, Unit 205",
    duration: "6 months",
    rate: "$1,200/month",
    submitted: "Submitted 1 week ago",
    status: "Approved",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export type Property = {
  deleteProperty: boolean;
  property_id: number;
  description: string;
  rental_fee: number;
  address: string;
  occupant_num: number;
  images: Buffer[];
  start_date: string;
  end_date: string;
  status: string;
};

export type HidePropertyParams = {
  id: string;
  property: Property;
};

export function useHideProperty(
  setIsHideLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setStatusIsActive: React.Dispatch<React.SetStateAction<boolean>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hideProperty,
    onMutate: () => {
      setIsHideLoading(true); // Set loading to true when mutation starts
    },
    onSuccess: (data) => {
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success(
        "Property has been successfully hidden from being displayed to the potential tenant."
      );
      setStatusIsActive(false);
      setIsHideLoading(false);
    },
    onError: (error: Error) => {
      toast.error("Failed to hide property. Please try again.");
      setIsHideLoading(false);
    },
  });
}

export function useUnhideProperty(
  setIsHideLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setStatusIsActive: React.Dispatch<React.SetStateAction<boolean>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unhideProperty,
    onMutate: () => {
      setIsHideLoading(true); // Set loading to true when mutation starts
    },
    onSuccess: (data) => {
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property has been successfully unhide!");
      setStatusIsActive(true);
      setIsHideLoading(false);
    },
    onError: (error: Error) => {
      toast.error("Failed to unhide property. Please try again.");
      setIsHideLoading(false);
    },
  });
}

export function useDeleteProperty(
  setIsHideLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: deleteProperty,
    onMutate: () => {
      setIsHideLoading(true); // Set loading to true when mutation starts
    },
    onSuccess: (data) => {
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property has been successfully deleted!");
      setIsHideLoading(false);
      router.push(`/owner`);
    },
    onError: (error: Error) => {
      //  toast.error("Failed to delete property. Please try again.");
      setIsHideLoading(false);
    },
  });
}

export async function hideProperty({ id, property }: HidePropertyParams) {
  const response = await fetch(`/api/property/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "inactive",
    }),
  });
  return response.json();
}

export async function unhideProperty({ id, property }: HidePropertyParams) {
  const response = await fetch(`/api/property/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "active",
    }),
  });
  return response.json();
}

export async function deleteProperty({ id, property }: HidePropertyParams) {
  const response = await fetch(`/api/property/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      deleteProperty: true,
      status: "trash",
    }),
  });
  return response.json();
}

const SinglePropertyPage = () => {
  const router = useRouter();
  const [isHideLoading, setIsHideLoading] = useState(false);
  const [isStatusActive, setStatusIsActive] = useState(false);
  const { id } = useParams(); // Extract the 'id' from the URL
  const {
    data: property,
    isLoading,
    isError,
  } = useQuery<Property>({
    queryKey: ["property", id],
    queryFn: async () => {
      const response = await fetch(`/api/property/${id}`);
      const { property } = await response.json();
      if (property.status === "active") {
        setStatusIsActive(true);
      }
      return {
        property_id: property.property_id,
        description: property.description,
        rental_fee: Number(property.rental_fee),
        address: property.address,
        occupant_num: property.occupant_num,
        images: property.images,
        start_date: property.start_date,
        end_date: property.end_date,
        status: property.status,
        deleteProperty: false,
      };
    },
  });
  // Initialize the mutation
  const hidePropertyMutation = useHideProperty(
    setIsHideLoading,
    setStatusIsActive
  );
  const unHidePropertyMutation = useUnhideProperty(
    setIsHideLoading,
    setStatusIsActive
  );

  const deletePropertyMutation = useDeleteProperty(setIsHideLoading);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  const handleHideProperty = async () => {
    if (id && property) {
      await hidePropertyMutation.mutateAsync({ id: id as string, property });
    }
  };

  const handleUnhideProperty = async () => {
    if (id && property) {
      await unHidePropertyMutation.mutateAsync({ id: id as string, property });
    }
  };

  const handleDeleteProperty = async () => {
    if (id && property) {
      await deletePropertyMutation.mutateAsync({ id: id as string, property });
    }
  };

  const [isEditLoading, setEditLoading] = useState(false); // State to track loading for Edit button

  const handleEditProperty = async () => {
    setEditLoading(true); // Set loading to true
    await router.push(`${window.location.pathname}/edit`); // Navigate to the edit page
    setEditLoading(false); // Optionally set loading to false after navigation
  };

  if (isLoading) {
    return (
      <div className="min-h-screen px-16 py-8 bg-stone-50">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="space-y-6">
          {/* Property Information Card Skeleton */}
          <div className="rounded-lg border bg-white">
            <div className="p-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-5 w-24 mb-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery Skeleton */}
          <div className="py-4">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <Skeleton key={index} className="aspect-[4/3] rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen px-16 py-8 bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Error Loading Property
          </h2>
          <p className="text-muted-foreground">
            Failed to load property details. Please try again later.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/owner")}
          >
            Return to Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-16 py-8 bg-stone-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-green-800">
          {property?.address}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-green-600"
            onClick={handleEditProperty} // Use the new handler
            disabled={isEditLoading} // Disable button while loading
          >
            {isEditLoading ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin h-4 w-4" />{" "}
                {/* Use the Loader icon */}
                Processing...
              </div>
            ) : (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Property
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="text-orange-600"
            onClick={isStatusActive ? handleHideProperty : handleUnhideProperty}
            disabled={isHideLoading}
          >
            {isHideLoading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-orange-600 border-t-transparent rounded-full"></span>
                Processing...
              </div>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                {isStatusActive ? "Hide Property" : "Unhide Property"}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="text-red-600"
            onClick={handleDeleteProperty}
            disabled={isHideLoading}
          >
            {isHideLoading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></span>
                Processing...
              </div>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Property
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="">
        <TabsList className="grid w-fit grid-cols-2 mb-6">
          <TabsTrigger value="details">Property Details</TabsTrigger>
          {/* <TabsTrigger value="proposals">Proposals</TabsTrigger> */}
        </TabsList>

        {/* Previous Property Details TabsContent remains the same */}
        <TabsContent value="details">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Property Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      {property?.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium mb-2">Details</h3>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Bed className="h-4 w-4" />
                        <span>{property?.occupant_num} Rooms</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>RM{property?.rental_fee} per month</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{property?.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {property?.start_date
                            ? formatDate(property?.start_date)
                            : "N/A"}{" "}
                          -{" "}
                          {property?.end_date
                            ? formatDate(property?.end_date)
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <PropertyGallery photos={property?.images || []}></PropertyGallery>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SinglePropertyPage;
