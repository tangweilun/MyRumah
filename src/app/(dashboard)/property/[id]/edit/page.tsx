"use client";
import React, { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { DatePickerWithRange } from "@/components/DateRangePicker";
import { toast } from "react-toastify";
import { propertyImage } from "@/lib/data";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
const EditProperty = () => {
  const router = useRouter();
  const { id } = useParams();
  const [saveStatus, setSaveStatus] = React.useState(false);
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
  useEffect(() => {
    if (saveStatus) {
      toast.success("Changes saved successfully!");
      setSaveStatus(false);
    }
  }, [saveStatus]);

  const handleSave = async () => {
    try {
      const response = await simulateSave();
      if (response.success) {
        setSaveStatus(true);
        router.back();
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      toast.error("Failed to save changes. Please try again.");
    }
  };

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
        image: property.image,
        start_date: property.start_date,
        end_date: property.end_date,
      };
    },
  });

  return (
    <div className="bg-stone-50 p-16 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-green-800">
          Edit Your Property
        </h1>
        <div className="space-x-2">
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleSave}
          >
            Save Changes
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input id="title" defaultValue="Cozy Cottage in the Woods" />
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="min-h-[100px]"
                  defaultValue={property?.description}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select defaultValue="cottage">
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cottage">Cottage</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input defaultValue={property?.address} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Rooms</Label>
                  <Input
                    type="number"
                    defaultValue={property?.occupant_num}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price per Month ($)</Label>
                  <Input type="number" defaultValue="1000" min="0" />
                </div>
                <div className="space-y-2">
                  <Label>Lease Start Date and Lease End Date</Label>
                  <DatePickerWithRange></DatePickerWithRange>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "WiFi",
                  "TV",
                  "Washer",
                  "Hot tub",
                  "Kitchen",
                  "Air conditioning",
                  "Dryer",
                  "BBQ grill",
                  "Free parking",
                  "Heating",
                  "Pool",
                  "Gym",
                ].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox id={amenity} />
                    <Label htmlFor={amenity}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </div>

        <div className="space-y-6">
          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {propertyImage.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-[4/3] bg-gray-100 rounded-md"
                  >
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Image
                      src={image.url}
                      alt={`Property photo ${image.id}`}
                      className="w-full h-full object-cover rounded-md"
                      width={400}
                      height={300}
                    />
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Photo
              </Button>
            </CardContent>
          </Card>

          {/* House Rules */}
          {/* <Card>
            <CardHeader>
              <CardTitle>House Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <span>Lease Start Date and Lease End Date</span>
              <DatePickerWithRange></DatePickerWithRange>
              <div className="space-y-4 mt-4">
                {["Pets Allowed", "Smoking Allowed", "Events Allowed"].map(
                  (rule) => (
                    <div key={rule} className="flex items-center space-x-2">
                      <Checkbox id={rule} />
                      <Label htmlFor={rule}>{rule}</Label>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

const simulateSave = async (): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 10);
  });
};

export default EditProperty;
