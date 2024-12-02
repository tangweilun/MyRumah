"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Upload, CalendarIcon, Loader2, X } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";

const formSchema = z.object({
  address: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  occupantNum: z.number(),
  rentalFee: z.string().regex(/^\d+$/, {
    message: "Please enter a valid number.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  images: z
    .custom<FileList>(
      (val) => val instanceof FileList,
      "Please upload at least one image."
    )
    .refine((files) => files.length > 0, "Please upload at least one image.")
    .refine(
      (files) =>
        Array.from(files).every((file) => file.type.startsWith("image/")),
      "Only image files are allowed."
    ),
  dateRange: z.object(
    {
      from: z.date(),
      to: z.date(),
    },
    {
      required_error: "Please select a date range.",
    }
  ),
});
export async function createProperty(formData: Record<string, any>) {
  const formDataObject: Record<string, any> = {};
  // Directly iterate over the formData object
  for (const key in formData) {
    if (formData.hasOwnProperty(key)) {
      if (key === "ownerId" || key === "rentalFee" || key === "occupantNum") {
        formDataObject[key] = Number(formData[key]); // Convert to number
      } else {
        formDataObject[key] = formData[key]; // Leave as is for other keys
      }
    }
  }

  const response = await fetch("/api/property", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataObject),
  });
  return response.json();
}

export function useCreateProperty(
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProperty,
    onMutate: () => {
      setIsLoading(true); // Set loading to true when mutation starts
    },
    onSuccess: (data) => {
      toast.success("Property has been successfully added!");
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setIsLoading(false);
      // redirect("/owner");
    },
    onError: (error: Error) => {
      toast.error("Failed to add property. Please try again.");
      setIsLoading(false);
    },
  });
}
export default function AddProperty() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const router = useRouter();
  const [images, setImages] = useState<FileList | null>(null);
  const { data: session } = useSession();

  const ownerId = session?.user?.user_id;
  // Initialize the mutation
  const createPropertyMutation = useCreateProperty(setIsLoading);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      occupantNum: 1,
      rentalFee: "",
      description: "",
      images: undefined,
      dateRange: {
        from: new Date(),
        to: addDays(new Date(), 365),
      },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const requestBody: any = {
      status: "active",
      address: values.address,
      occupantNum: values.occupantNum,
      rentalFee: values.rentalFee,
      description: values.description,
    };

    // Add ownerId if available
    if (ownerId) {
      requestBody.ownerId = Number(ownerId);
    }

    // Handle date range
    if (values.dateRange?.from && values.dateRange?.to) {
      requestBody.startDate = values.dateRange.from.toLocaleDateString("en-CA");
      requestBody.endDate = values.dateRange.to.toLocaleDateString("en-CA");
    }

    // Handle images
    if (values.images && values.images.length > 0) {
      const base64Images = await Promise.all(
        Array.from(values.images).map(async (file) => {
          const base64 = await convertToBase64(file);
          return `data:${file.type};base64,${base64.split(",")[1]}`;
        })
      );

      // Add images array directly to request body
      requestBody.images = base64Images;
    }

    try {
      await createPropertyMutation.mutateAsync(requestBody);
    } catch (error) {
      console.error("Error creating property:", error);
    }
  }

  // Function to convert file to base64
  function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleCancel = async () => {
    setIsCanceling(true);
    router.push("/owner");
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="container mx-auto px-6 py-8 max-w-7xl bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Add New Property</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Basic Information</h2>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Technology Park 54000, Kuala Lumpur"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="occupantNum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Rooms</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={field.value?.toString()} // Convert to string for default
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Number of Rooms" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 Room</SelectItem>
                            <SelectItem value="2">2 Rooms</SelectItem>
                            <SelectItem value="3">3 Rooms</SelectItem>
                            <SelectItem value="4">4 Rooms</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rentalFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Price (RM)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 1200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Property Details</h2>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your property..."
                          className="h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Available Dates</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              id="date"
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value?.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, "LLL dd, y")} -{" "}
                                    {format(field.value.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(field.value.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date range</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={field.value?.from}
                            selected={field.value}
                            onSelect={field.onChange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Images</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground text-center">
                            Upload your images here
                          </p>
                          <input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files) {
                                // Combine existing files with new files
                                const existingFiles = field.value
                                  ? Array.from(field.value)
                                  : [];
                                const newFiles = Array.from(files);
                                const dataTransfer = new DataTransfer();

                                // Add all files to DataTransfer object
                                [...existingFiles, ...newFiles].forEach(
                                  (file) => {
                                    dataTransfer.items.add(file);
                                  }
                                );

                                field.onChange(dataTransfer.files);
                                setImages(dataTransfer.files);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document.getElementById("images")?.click()
                            }
                          >
                            Choose Files
                          </Button>
                        </div>

                        {/* File Count Display */}
                        {field.value && field.value.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {field.value.length}{" "}
                            {field.value.length === 1 ? "file" : "files"}{" "}
                            selected
                          </div>
                        )}

                        {/* Image Previews */}
                        {field.value && field.value.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Array.from(field.value).map((file, index) => (
                              <div
                                key={index}
                                className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
                              >
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                {/* Overlay with file name and size */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                  <div className="text-white text-xs truncate">
                                    {file.name}
                                  </div>
                                  <div className="text-white text-xs">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                  </div>
                                </div>
                                {/* Delete Button */}
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    const dt = new DataTransfer();
                                    const files = Array.from(
                                      field.value as FileList
                                    );
                                    files.forEach((f, i) => {
                                      if (i !== index) dt.items.add(f);
                                    });
                                    field.onChange(dt.files);
                                    setImages(dt.files);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload images of your property. You can select multiple
                      files. Only image formats are allowed. Maximum file size:
                      5MB per image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                type="button"
                disabled={isLoading || isCanceling}
                onClick={handleCancel}
              >
                {isCanceling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Canceling...
                  </>
                ) : (
                  "Back"
                )}
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Property"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
