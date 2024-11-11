'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  MapPin,
  BedDouble,
  Bath,
  Home,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PropertyPage() {
  const images = ['/1.png', '/2.png', '/3.png', '/4.png', '/5.png'];

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const nextImg = () => {
    setCurrentImgIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImg = () => {
    setCurrentImgIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="bg-green-100 w-screen py-16">
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
                    index === currentImgIndex ? 'bg-green-700' : 'bg-gray-300'
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
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-green-900 mb-4">
                  Modern Apartment 1
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

            <Button className="w-full bg-green-700 hover:bg-green-800">
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
