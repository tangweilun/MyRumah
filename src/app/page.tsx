'use client';

import Navbar from '@/components/Navbar';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PropertyGrid from '@/components/PropertyGrid';

export default function Home() {
  return (
    <div>
      <Navbar />
      {/* Hero section with search */}
      <div className="bg-green-100 py-16 md:py-24 lg:py-32">
        <div className="max-w-xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-green-900 mb-4 text-center md:text-5xl">
            Explore Decentralized Rentals with MyRumah
          </h1>
          <p className="text-xl text-green-700 mb-8 text-center md:text-2xl">
            Discover trusted rentals powered by blockchain technology for
            transparent, secure, and hassle-free agreements.
          </p>
          <div className="flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden bg-white">
            <div className="flex-grow flex items-center mb-4 md:mb-0">
              <MapPin className="h-5 w-5 text-stone-400 ml-3" />
              <Input
                type="text"
                placeholder="Where do you want to stay?"
                className="border-none focus:ring-0"
              />
            </div>
            <Button
              size="lg"
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
      {/* Properties listing */}
      <div>
        <PropertyGrid />
      </div>
    </div>
  );
}
