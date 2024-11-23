"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  MapPin,
  BedDouble,
  Bath,
  Home,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
//import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PropertyPage() {
  const propertyName = "Modern Apartment 1";

  const images = ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png"];

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const nextImg = () => {
    setCurrentImgIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImg = () => {
    setCurrentImgIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const [moveInDate, setMoveInDate] = useState(new Date());

  return (
    <div>
      <div className="bg-green-100 w-screen py-16">
        <div className="flex items-start justify-between p-6">
          <div>
            <h2 className="text-2xl font-bold text-green-900 mb-4">
              {propertyName}
            </h2>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <span className="text-xl text-green-700">
                123 Main St, Downtown Area, City, 12345
              </span>
            </div>
          </div>
          <button className="rounded-full p-2 hover:bg-gray-100">
            <Heart className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 p-6">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-lg">
              <Image
                src={images[currentImgIndex]}
                width={800}
                height={600}
                alt={`Property Image ${currentImgIndex + 1}`}
                className="object-center mx-auto"
              />
              <button
                onClick={prevImg}
                className="absolute left-2 top-1/2 rounded-full -translate-y-1/2 bg-black/50 hover:bg-black/75"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-2 top-1/2 rounded-full -translate-y-1/2 bg-black/50 hover:bg-black/75"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            <div className="flex space-x-2 justify-center overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImgIndex(index)}
                  className={`aspect-[4/3] h-20 flex-shrink-0 rounded-lg ${
                    index === currentImgIndex ? "bg-green-700" : "bg-gray-300"
                  }`}
                >
                  <Image
                    src={image}
                    width={800}
                    height={600}
                    alt={`Image ${index + 1}`}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 mr-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border bg-white p-4">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-green-600" />
                  <span className="font-medium">2 Bedrooms</span>
                </div>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-green-600" />
                  <span className="font-medium">2 Bathrooms</span>
                </div>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-green-600" />
                  <span className="font-medium">1,200 sq ft</span>
                </div>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Available Now</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="mt-2 text-gray-600">
                This modern apartment offers a comfortable living space with
                high-end finishes and amenities. Enjoy the open-concept layout,
                fully equipped kitchen, and private balcony with city views.
                Located in the heart of downtown, you'll have easy access to
                restaurants, shops, and public transportation.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Price</h3>
              <p className="mt-2 text-2xl font-bold text-green-700">
                RM600/month
              </p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-green-700 hover:bg-green-800">
                  Apply Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Rental Application</DialogTitle>
                </DialogHeader>
                <form className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="moveInDate">Move-In Date</Label>
                    {/* <DatePicker
                      id="moveInDate"
                      selected={moveInDate}
                      onChange={(date: Date) => setMoveInDate(date)}
                      dateFormat="MMMM d, yyyy"
                      minDate={new Date()}
                      className="w-full rounded-md border border-input px-3 py-2"
                    /> */}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" className="resize-none" />
                  </div>
                </form>
                <DialogFooter>
                  <Button type="submit">Submit Application</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
