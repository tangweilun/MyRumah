"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  BedDouble,
  HomeIcon,
  Loader2,
  Calendar,
  DollarSign,
  Home,
  Menu,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import MetricCard from "./MetricCard";

type Property = {
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

export default function MyPropertiesGrid() {
  const { data: session } = useSession();
  console.log("Session " + session);
  const userId = session?.user.user_id;
  const role = session?.user.role;
  const router = useRouter();
  const {
    data: properties,
    isLoading,
    isError,
  } = useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await fetch(
        `/api/property?userId=${userId}&role=${role}`
      );
      const json = await response.json();
      return json.properties.map((property: Property) => ({
        ...property,
        images: property.images || [], // Ensure images is always an array
        rental_fee: Number(property.rental_fee),
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

  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});

  const handleViewDetails = async (propertyId: number) => {
    setLoadingStates((prev: any) => ({ ...prev, [propertyId]: true }));

    try {
      await router.push(`/owner/property/${propertyId}`);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [propertyId]: false }));
    }
  };

  // Calculate metrics dynamically
  const metrics = useMemo(() => {
    if (!properties)
      return { totalProperties: 0, activeBookings: 0, totalEarnings: 0 };

    const currentDate = new Date();

    const totalProperties = properties.length;

    const activeBookings = properties.filter(
      (property) => property.status === "occupied"
    ).length;

    const totalEarnings = properties
      .filter(
        (property) =>
          property.status === "occupied" &&
          currentDate >= new Date(property.start_date) &&
          currentDate <= new Date(property.end_date)
      )
      .reduce((sum, property) => sum + property.rental_fee, 0);

    return { totalProperties, activeBookings, totalEarnings };
  }, [properties]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex flex-col sm:flex-row gap-16 py-4 mb-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <MetricCardSkeleton key={`metric-${index}`} />
          ))}
        </div>
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
    <div>
      <div className="flex flex-col sm:flex-row gap-16 py-4">
        <MetricCard
          title="Total Properties"
          icon={Home}
          number={metrics.totalProperties}
          description={`${metrics.totalProperties} properties available`}
          iconColor="text-green-700"
        />
        <MetricCard
          title="Active Bookings"
          icon={Calendar}
          number={metrics.activeBookings}
          description={`${metrics.activeBookings} currently occupied`}
          iconColor="text-green-700"
        />
        {/* <MetricCard
          title="Total Earnings"
          icon={DollarSign}
          number={`$${metrics.totalEarnings}`}
          description={`Earnings this month`}
          iconColor="text-green-700"
        /> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties?.map((property) => (
          <Card key={property.property_id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              {property.images && property.images.length > 0 ? (
                <Image
                  src={`data:image/jpeg;base64,${Buffer.from(
                    Object.values(property.images[0])
                  ).toString("base64")}`}
                  alt={property.description || "Property Image"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <HomeIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-green-600">
                  {property.address}
                </h3>
                <span className="text-lg font-semibold text-green-600">
                  ${property.rental_fee}
                </span>
              </div>
              <p className="text-muted-foreground mb-2">
                {property.description}
              </p>
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
                onClick={() => handleViewDetails(property.property_id)}
                disabled={loadingStates[property.property_id]}
              >
                {loadingStates[property.property_id] ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "View Details"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
// ... rest of the component remains the same
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
        You haven't add any property yet!
      </p>
    </div>
  );
};

const MetricCardSkeleton = () => {
  return (
    <Card className="flex-1">
      <CardContent className="p-6">
        <div className="flex justify-between items-start space-y-0.5">
          <div className="space-y-2">
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-36 animate-pulse rounded bg-gray-200 mt-2" />
          </div>
          <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
        </div>
      </CardContent>
    </Card>
  );
};
