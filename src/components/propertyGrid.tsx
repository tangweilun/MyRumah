'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Bed } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

type PropertyCardProps = {
  title: string;
  price: number;
  location: string;
  rooms: number;
  imageUrl?: string;
};

const PropertyCard = ({
  title,
  price,
  location,
  rooms,
  imageUrl,
}: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const toggleLike = () => {
    if (!isSignedIn) {
      router.push('/sign-up');
      return;
    }
    setIsLiked((prev) => !prev);
  };

  const handleApplyNow = () => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    // Handle the application process for signed-in users
    router.push(
      `/dashboard/property/apply?property=${encodeURIComponent(title)}`
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Card>
        {/* Image Section */}
        <div className="relative h-48 bg-gray-200">
          <Image
            width={300}
            height={192}
            src={imageUrl || '/api/placeholder/300/192'}
            alt={title}
            className="h-full w-full object-cover"
          />
          <Button
            variant={'outline'}
            className={`absolute right-2 top-2 p-1.5 transition-all duration-300 ${
              isLiked ? 'bg-red-400' : 'bg-white'
            } rounded-md`}
            onClick={toggleLike}
          >
            {isLiked ? (
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white" />
            ) : (
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-gray-600" />
            )}
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="font-medium text-green-700">{title}</h3>
              <p className="text-sm text-gray-600">{location}</p>
            </div>
            <p className="font-medium text-green-700">${price}/mo</p>
          </div>

          <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{rooms} Rooms</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={handleApplyNow}
          >
            {isSignedIn ? 'Apply Now' : 'Sign in to Apply'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const PropertyGrid = () => {
  const [properties, setProperties] = useState<PropertyCardProps[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await new Promise<PropertyCardProps[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              title: 'Modern Apartment 1',
              price: 1200,
              location: 'Downtown Area',
              rooms: 2,
              imageUrl: '/propertyImage1.jpeg',
            },
            {
              title: 'Modern Apartment 2',
              price: 1200,
              location: 'Downtown Area',
              rooms: 2,
              imageUrl: '/propertyImage2.jpeg',
            },
            {
              title: 'Modern Apartment 3',
              price: 1200,
              location: 'Downtown Area',
              rooms: 2,
              imageUrl: '/propertyImage3.jpeg',
            },
          ]);
        }, 1000);
      });
      setProperties(response);
    };

    fetchProperties();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-xl font-medium text-green-700">
        Featured Homes for Rent
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property, index) => (
          <PropertyCard key={index} {...property} />
        ))}
      </div>
    </div>
  );
};

export default PropertyGrid;
