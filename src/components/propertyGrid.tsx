"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Bed, AlertCircle, HomeIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type Property = {
  property_id: number;
  title: string;
  description: string;
  rental_fee: number;
  address: string;
  occupant_num: number;
  image?: string | null;
};

type PropertyCardProps = {
  title: string;
  rental_fee: number;
  location: string;
  occupant_num: number;
  imageUrl: string;
};

const PropertyCard = ({
  title,
  rental_fee,
  location,
  occupant_num,
  imageUrl,
}: PropertyCardProps) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  const toggleLike = () => {
    if (!isAuthenticated) {
      router.push("/sign-up");
      return;
    }
    setIsLiked((prev) => !prev);
  };

  const handleApplyNow = () => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    }
    router.push(
      `/dashboard/property/apply?property=${encodeURIComponent(title)}`
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Card>
        <div className="relative h-48 bg-gray-200">
          <Image
            width={300}
            height={192}
            src={imageUrl || "/placeholder.jpg"}
            alt={title}
            className="h-full w-full object-cover"
          />
          <Button
            variant="outline"
            className={`absolute right-2 top-2 p-1.5 transition-all duration-300 ${
              isLiked ? "bg-red-400" : "bg-white"
            } rounded-md`}
            onClick={toggleLike}
          >
            <Heart
              className={`h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 ${
                isLiked ? "text-white" : "text-gray-600"
              }`}
            />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="font-medium text-green-700">{title}</h3>
              <p className="text-sm text-gray-600">{location}</p>
            </div>
            <p className="font-medium text-green-700">${rental_fee}/mon</p>
          </div>

          <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{occupant_num} Rooms</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={handleApplyNow}
          >
            Apply Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const PropertySkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 animate-pulse bg-gray-200" />
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
      </CardFooter>
    </Card>
  );
};

const PropertyError = ({ message }: { message: string }) => {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-sm">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-red-50 p-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
        </div>
        <p className="mb-6 text-sm text-gray-500">{message}</p>
        <Button
          onClick={() => window.location.reload()}
          className="w-full bg-green-600 text-white hover:bg-green-700"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <div className="rounded-full bg-gray-100 p-4">
        <HomeIcon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold">No Properties Available</h3>
      <p className="text-center text-sm text-gray-500">
        There are currently no properties listed. Please check back later.
      </p>
    </div>
  );
};

const PropertyGrid = () => {
  const {
    data: properties,
    isLoading,
    isError,
  } = useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await fetch("/api/property");
      const json = await response.json();
      return json.properties.map((property: any) => ({
        property_id: property.property_id,
        title: property.description,
        rental_fee: Number(property.rental_fee),
        location: property.address,
        occupant_num: property.occupant_num,
        imageUrl: property.image,
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertySkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <PropertyError message={"Something went wrong"} />;
  }

  if (!properties?.length) {
    return <EmptyState />;
  }
  if (!properties?.length) {
    return (
      <div className="p-8 text-center">
        <p>No properties available.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard
            key={property.property_id}
            title={property.title}
            rental_fee={Number(property.rental_fee)}
            location={property.address}
            occupant_num={property.occupant_num}
            imageUrl={property.image || "/placeholder.jpg"}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyGrid;
