"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Home,
  Calendar,
  MapPin,
  Loader,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

type Property = {
  property_id: number;
  description: string;
  rental_fee: number;
  address: string;
  occupant_num: number;
  images: string[];
  start_date: string;
  end_date: string;
  status: string;
};

export default function TenantSingleProperyPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();

  const {
    data: property,
    isLoading,
    isError,
  } = useQuery<Property>({
    queryKey: ["property", id],
    queryFn: async () => {
      const response = await fetch(`/api/property/${id}`);
      const { property } = await response.json();
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
      };
    },
  });

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (property?.images.length || 1));
  };

  const previousImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (property?.images.length || 1)) %
        (property?.images.length || 1)
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

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
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading property data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 mx-auto py-8 px-24 space-y-6">
      <div className="space-y-2"></div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
              onClick={previousImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            {property?.images && property.images.length > 0 && (
              <Image
                src={`data:image/jpeg;base64,${Buffer.from(
                  property.images[currentImageIndex]
                ).toString("base64")}`}
                alt={`Apartment image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {property?.images.map((src, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative w-20 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 ${
                  currentImageIndex === index ? "ring-2 ring-green-500" : ""
                }`}
              >
                <Image
                  src={`data:image/jpeg;base64,${Buffer.from(src).toString(
                    "base64"
                  )}`}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-gray-600">{property?.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Price</h2>
            <p className="text-3xl font-bold text-green-700">
              RM{property?.rental_fee}/month
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="flex items-center gap-2 p-4">
                <Bed className="w-5 h-5 text-green-600" />
                <span>{property?.occupant_num} Rooms</span>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-2 p-4">
                <MapPin className="w-5 h-5 text-green-600" />
                <span>{property?.address} </span>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Start Date - End Date</h2>
            <p className="text-gray-600">
              {property?.start_date && property?.end_date
                ? `${formatDate(property.start_date)} - ${formatDate(
                    property.end_date
                  )}`
                : "Dates not specified"}
            </p>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg">
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}
