"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, BedDouble, Calendar, HomeIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type Property = {
  property_id: number;
  description: string;
  rental_fee: number;
  address: string;
  occupant_num: number;
  image?: string | null;
  start_date: string;
  end_date: string;
};

export default function PropertyGrid() {
  const router = useRouter();
  const {
    data: properties,
    isLoading,
    isError,
  } = useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await fetch(`/api/property`);
      const json = await response.json();
      return json.properties.map((property: Property) => ({
        property_id: property.property_id,
        description: property.description,
        rental_fee: Number(property.rental_fee),
        address: property.address,
        occupant_num: property.occupant_num,
        image: property.image,
        start_date: property.start_date,
        end_date: property.end_date,
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
      {properties?.map((property) => (
        <Card key={property.property_id} className="overflow-hidden">
          <div className="relative h-48 w-full">
            {property.image && (
              <Image
                src={`data:image/jpeg;base64,${Buffer.from(
                  property.image
                ).toString("base64")}`}
                alt={"/placeholder.jpg"}
                fill
                className="object-cover"
              />
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-green-600">
                {property.description}
              </h3>
              <span className="text-lg font-semibold text-green-600">
                ${property.rental_fee}
              </span>
            </div>
            <p className="text-muted-foreground mb-2">{property.address}</p>
            <div className="flex items-center text-muted-foreground">
              <BedDouble className="h-4 w-4 mr-2" />
              <span>{property.occupant_num} Rooms</span>
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                {formatDate(property.start_date)} -{" "}
                {formatDate(property.end_date)}
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => router.push(`/property/${property.property_id}`)}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

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
