'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Heart, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PropertyPage() {
  const images = [
    '/image.png',
    '/image.png',
    '/image.png',
    '/image.png',
    '/image.png',
  ];

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
                width={600}
                height={100}
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
          </div>

          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-green-900 mb-4">
                  Modern Apartment 1
                </h3>
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
          </div>
        </div>
      </div>
    </div>
  );
}
