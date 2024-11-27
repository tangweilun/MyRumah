// "use client";
// import React, { use } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Trash, Plus } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { DatePickerWithRange } from "@/components/DateRangePicker";
// import { toast } from "react-toastify";
// import { propertyImage } from "@/lib/data";
// import Image from "next/image";
// import { useQuery } from "@tanstack/react-query";
// const EditProperty = () => {
//   const router = useRouter();
//   const { id } = useParams();
//   const [saveStatus, setSaveStatus] = React.useState(false);
//   type Property = {
//     property_id: number;
//     description: string;
//     rental_fee: number;
//     address: string;
//     occupant_num: number;
//     image?: string | null;
//     start_date: string;
//     end_date: string;
//   };
//   useEffect(() => {
//     if (saveStatus) {
//       toast.success("Changes saved successfully!");
//       setSaveStatus(false);
//     }
//   }, [saveStatus]);

//   const handleSave = async () => {
//     try {
//       const response = await simulateSave();
//       if (response.success) {
//         setSaveStatus(true);
//         router.back();
//       } else {
//         throw new Error("Save failed");
//       }
//     } catch (error) {
//       toast.error("Failed to save changes. Please try again.");
//     }
//   };

//   const {
//     data: property,
//     isLoading,
//     isError,
//   } = useQuery<Property>({
//     queryKey: ["property", id],
//     queryFn: async () => {
//       const response = await fetch(`/api/property/${id}`);
//       const { property } = await response.json();

//       return {
//         property_id: property.property_id,
//         description: property.description,
//         rental_fee: Number(property.rental_fee),
//         address: property.address,
//         occupant_num: property.occupant_num,
//         image: property.image,
//         start_date: property.start_date,
//         end_date: property.end_date,
//       };
//     },
//   });

//   return (
//     <div className="bg-stone-50 p-16 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-semibold text-green-800">
//           Edit Your Property
//         </h1>
//         <div className="space-x-2">
//           <Button
//             className="bg-green-600 hover:bg-green-700"
//             onClick={handleSave}
//           >
//             Save Changes
//           </Button>
//           <Button variant="outline" onClick={() => router.back()}>
//             Cancel
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           {/* Basic Information */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Basic Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {/* <div className="space-y-2">
//                 <Label htmlFor="title">Property Title</Label>
//                 <Input id="title" defaultValue="Cozy Cottage in the Woods" />
//               </div> */}

//               <div className="space-y-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   className="min-h-[100px]"
//                   defaultValue={property?.description}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* <div className="space-y-2">
//                   <Label>Property Type</Label>
//                   <Select defaultValue="cottage">
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select property type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="cottage">Cottage</SelectItem>
//                       <SelectItem value="apartment">Apartment</SelectItem>
//                       <SelectItem value="house">House</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div> */}

//                 <div className="space-y-2">
//                   <Label>Address</Label>
//                   <Input defaultValue={property?.address} />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Details */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Details</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <Label>Rooms</Label>
//                   <Input
//                     type="number"
//                     defaultValue={property?.occupant_num}
//                     min="0"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Price per Month ($)</Label>
//                   <Input type="number" defaultValue="1000" min="0" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Lease Start Date and Lease End Date</Label>
//                   <DatePickerWithRange></DatePickerWithRange>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Amenities */}
//           {/* <Card>
//             <CardHeader>
//               <CardTitle>Amenities</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 {[
//                   "WiFi",
//                   "TV",
//                   "Washer",
//                   "Hot tub",
//                   "Kitchen",
//                   "Air conditioning",
//                   "Dryer",
//                   "BBQ grill",
//                   "Free parking",
//                   "Heating",
//                   "Pool",
//                   "Gym",
//                 ].map((amenity) => (
//                   <div key={amenity} className="flex items-center space-x-2">
//                     <Checkbox id={amenity} />
//                     <Label htmlFor={amenity}>{amenity}</Label>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card> */}
//         </div>

//         <div className="space-y-6">
//           {/* Photos */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Photos</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 gap-4">
//                 {propertyImage.map((image) => (
//                   <div
//                     key={image.id}
//                     className="relative aspect-[4/3] bg-gray-100 rounded-md"
//                   >
//                     <Button
//                       size="icon"
//                       variant="destructive"
//                       className="absolute top-2 right-2 h-6 w-6"
//                     >
//                       <Trash className="h-4 w-4" />
//                     </Button>
//                     <Image
//                       src={image.url}
//                       alt={`Property photo ${image.id}`}
//                       className="w-full h-full object-cover rounded-md"
//                       width={400}
//                       height={300}
//                     />
//                   </div>
//                 ))}
//               </div>
//               <Button className="w-full mt-4" variant="outline">
//                 <Plus className="mr-2 h-4 w-4" /> Add Photo
//               </Button>
//             </CardContent>
//           </Card>

//           {/* House Rules */}
//           {/* <Card>
//             <CardHeader>
//               <CardTitle>House Rules</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <span>Lease Start Date and Lease End Date</span>
//               <DatePickerWithRange></DatePickerWithRange>
//               <div className="space-y-4 mt-4">
//                 {["Pets Allowed", "Smoking Allowed", "Events Allowed"].map(
//                   (rule) => (
//                     <div key={rule} className="flex items-center space-x-2">
//                       <Checkbox id={rule} />
//                       <Label htmlFor={rule}>{rule}</Label>
//                     </div>
//                   )
//                 )}
//               </div>
//             </CardContent>
//           </Card> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// const simulateSave = async (): Promise<{ success: boolean }> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ success: true });
//     }, 10);
//   });
// };

// export default EditProperty;
"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash, Plus, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { propertyImage } from "@/lib/data";

// Zod imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Shadcn Form components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Zod Schema (similar to add page)
const editPropertySchema = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  occupantNum: z.number().min(1, {
    message: "Number of rooms must be at least 1.",
  }),
  rentalFee: z.string().regex(/^\d+$/, {
    message: "Please enter a valid number.",
  }),
  images: z.custom<FileList | null>().optional(),
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

const EditProperty = () => {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();

  // Property type definition
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

  // Fetch property data
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

  // Mutation for updating property
  const updatePropertyMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`/api/property/${id}`, {
        method: "PUT",
        body: formData,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property", id] });
      toast.success("Property updated successfully!");
      router.back();
    },
    onError: () => {
      toast.error("Failed to update property. Please try again.");
    },
  });

  // Form initialization
  const form = useForm<z.infer<typeof editPropertySchema>>({
    resolver: zodResolver(editPropertySchema),
    defaultValues: {
      description: property?.description || "",
      address: property?.address || "",
      occupantNum: property?.occupant_num || 1,
      rentalFee: property?.rental_fee.toString() || "",
      images: null,
      dateRange: {
        from: property ? new Date(property.start_date) : new Date(),
        to: property ? new Date(property.end_date) : addDays(new Date(), 365),
      },
    },
  });

  // Convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Submit handler
  const onSubmit = async (values: z.infer<typeof editPropertySchema>) => {
    const formData = new FormData();

    // Append other form fields
    formData.append("description", values.description);
    formData.append("address", values.address);
    formData.append("occupantNum", values.occupantNum.toString());
    formData.append("rentalFee", values.rentalFee);

    // Handle date range
    if (values.dateRange.from && values.dateRange.to) {
      formData.append(
        "startDate",
        values.dateRange.from.toLocaleDateString("en-CA")
      );
      formData.append(
        "endDate",
        values.dateRange.to.toLocaleDateString("en-CA")
      );
    }

    // Handle image uploads
    if (values.images) {
      const base64Images = await Promise.all(
        Array.from(values.images).map(async (file) => {
          const base64 = await convertToBase64(file);
          return base64;
        })
      );
      base64Images.forEach((base64) => {
        formData.append("image", base64);
      });
    }

    // Trigger mutation
    updatePropertyMutation.mutate(formData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading property</div>;

  return (
    <div className="bg-stone-50 p-16 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-green-800">
          Edit Your Property
        </h1>
        <div className="space-x-2">
          <Button
            type="button"
            className="bg-green-600 hover:bg-green-700"
            onClick={form.handleSubmit(onSubmit)}
            disabled={updatePropertyMutation.isPending}
          >
            {updatePropertyMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={updatePropertyMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <Textarea className="min-h-[100px]" {...field} />
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
                            <Input {...field} />
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
                      name="occupantNum"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rooms</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select number of rooms" />
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
                          <FormLabel>Price per Month ($)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min="0" />
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
                          <FormLabel>Lease Dates</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
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
                                        {format(field.value.from, "LLL dd, y")}{" "}
                                        - {format(field.value.to, "LLL dd, y")}
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
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
                                type="button"
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
                        <FormControl>
                          <div>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                field.onChange(e.target.files);
                              }}
                              id="images"
                            />
                            <Button
                              type="button"
                              className="w-full mt-4"
                              variant="outline"
                              onClick={() =>
                                document.getElementById("images")?.click()
                              }
                            >
                              <Plus className="mr-2 h-4 w-4" /> Add Photo
                            </Button>
                          </div>
                        </FormControl>
                        {field.value && (
                          <p className="text-sm text-muted-foreground">
                            {(field.value as FileList).length} files selected
                          </p>
                        )}
                      </FormItem>
                    )}
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
