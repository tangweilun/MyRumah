'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BedDouble } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Sample data - in a real app this would come from an API/database
const properties = [
  {
    id: 1,
    name: 'Modern Apartment 1',
    price: '$1200/mo',
    location: 'Downtown Area',
    rooms: 2,
    image: '/propertyImage1.jpeg',
  },
  {
    id: 2,
    name: 'Modern Apartment 2',
    price: '$1200/mo',
    location: 'Downtown Area',
    rooms: 2,
    image: '/propertyImage3.jpeg',
  },
  {
    id: 3,
    name: 'Modern Apartment 3',
    price: '$1200/mo',
    location: 'Downtown Area',
    rooms: 2,
    image: '/propertyImage2.jpeg',
  },
  {
    id: 4,
    name: 'Modern Apartment 3',
    price: '$1200/mo',
    location: 'Downtown Area',
    rooms: 2,
    image: '/propertyImage1.jpeg',
  },
  {
    id: 5,
    name: 'Modern Apartment 3',
    price: '$1200/mo',
    location: 'Downtown Area',
    rooms: 2,
    image: '/propertyImage3.jpeg',
  },
];

export default function MyPropertiesGrid() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card key={property.id} className="overflow-hidden">
          <div className="relative h-48 w-full">
            <Image
              src={property.image}
              alt={property.name}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-green-600">
                {property.name}
              </h3>
              <span className="text-lg font-semibold text-green-600">
                {property.price}
              </span>
            </div>
            <p className="text-muted-foreground mb-2">{property.location}</p>
            <div className="flex items-center text-muted-foreground">
              <BedDouble className="h-4 w-4 mr-2" />
              <span>{property.rooms} Rooms</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => router.push(`/property/${property.id}`)}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
