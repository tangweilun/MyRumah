"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { Trash, Plus, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import * as z from "zod";

import { DatePickerWithRange } from "@/components/DateRangePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";

type Property = {
  deleteProperty: boolean;
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
// Zod validation schema
const formSchema = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  occupant_num: z.coerce.number().min(0, {
    message: "Number of rooms must be non-negative.",
  }),
  rental_fee: z.coerce.number().min(0, {
    message: "Price must be non-negative.",
  }),
});

const EditProperty = () => {
  const router = useRouter();
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
        deleteProperty: false,
      };
    },
  });
  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: property?.description || "",
      address: property?.address || "",
      occupant_num: property?.occupant_num || 1,
      rental_fee: property?.rental_fee || 1000,
    },
  });

  const { watch } = form; // Track form changes using watch
  const currentValues = watch(); // Get current form values

  // Function to convert Buffer to Base64
  const convertBufferToBase64 = (buffer: Buffer): string => {
    return `data:image/jpeg;base64,${buffer.toString("base64")}`; // Adjust the type if necessary
  };

  const mutation = useMutation({
    mutationFn: async (data: Partial<Property>) => {
      // Convert existingImages (Buffers) to Base64 format
      const base64Images = existingImages.map((imageBuffer) => {
        // If it's a Buffer object with data array
        if (imageBuffer && imageBuffer.type === "Buffer" && imageBuffer.data) {
          return `data:image/jpeg;base64,${Buffer.from(
            imageBuffer.data
          ).toString("base64")}`;
        }
        // If it's already a base64 string
        if (
          typeof imageBuffer === "string" &&
          imageBuffer.startsWith("data:image")
        ) {
          return imageBuffer;
        }
        return convertBufferToBase64(imageBuffer);
      });
      data.images = base64Images;
      data.deleteProperty = false;

      const response = await fetch(`/api/property/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update property");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Property updated successfully!");
      router.push(`/owner/property/${id}`); // Redirect after successful update
    },
    onError: () => {
      toast.error("Failed to update property.");
    },
  });

  const initialValues = {
    description: property?.description || "",
    address: property?.address || "",
    occupant_num: property?.occupant_num || 1,
    rental_fee: property?.rental_fee || 1000,
  };

  const handleSave = () => {
    const updates: Partial<Property> = {};
    const keys = Object.keys(currentValues) as (keyof typeof initialValues)[];

    keys.forEach((key) => {
      if (currentValues[key] !== initialValues[key]) {
        updates[key] = currentValues[key] as any;
      }
    });

    mutation.mutate(updates); // Trigger the mutation with the updates
  };

  const [existingImages, setExistingImages] = useState<any[]>(
    property?.images || []
  );
  const [newImages, setNewImages] = useState<FileList | null>(null);

  // Function to convert file to Buffer
  const convertToBuffer = (file: File): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer
        resolve(buffer);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
    });
  };

  // Function to handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const existingFiles = existingImages; // Keep existing image URLs
      const newFiles = Array.from(files);
      // Convert new files to Buffer
      const newImageBuffers = await Promise.all(
        newFiles.map(async (file) => {
          const buffer = await convertToBuffer(file);
          return buffer; // Return the Buffer
        })
      );
      setExistingImages([...existingFiles, ...newImageBuffers]); // Update existing images for display
    }
  };

  // Function to trigger file input
  const handleAddPhotoClick = () => {
    document.getElementById("fileInput")?.click();
  };

  // Function to handle image deletion
  const handleImageDelete = (index: number) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
  };

  return (
    <div className="min-h-screen bg-stone-50 p-16 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-green-800">
          Edit Your Property
        </h1>
        <div className="space-x-2">
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={form.handleSubmit(handleSave)}
          >
            Save Changes
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your property"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                    <FormField
                      control={form.control}
                      name="occupant_num"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rooms</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rental_fee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per Month (RM)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormItem>
                      <FormLabel>Lease Start and End Date</FormLabel>
                      <DatePickerWithRange />
                    </FormItem>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Photos */}
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {existingImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
                      >
                        <img
                          // src={image}
                          src={`data:image/jpeg;base64,${Buffer.from(
                            image
                          ).toString("base64")}`}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => handleImageDelete(index)} // Call the delete function
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="py-2"></div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddPhotoClick}
                  >
                    + Add Photo
                  </Button>
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProperty;
