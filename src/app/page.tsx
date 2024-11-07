import Navbar from '@/components/Navbar';
import { MapPin, Search } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      {/* Hero section with search */}
      <div className="bg-green-100 py-16">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold text-green-900 mb-4 text-center">
            Explore Decentralized Rentals with MyRumah Add textting
          </h1>
          <p className="text-xl text-green-700 mb-8 text-center">
            Discover trusted rentals powered by blockchain technology for
            transparent, securee, and hassle-free agreements.
          </p>
          <div className="flex shadow-lg rounded-lg overflow-hidden bg-white">
            <div className="flex-grow flex items-center">
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
    </div>
  );
}
