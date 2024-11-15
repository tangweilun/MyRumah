'use client';

import Navbar from '@/components/Navbar';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PropertyGrid from '@/components/PropertyGrid';
import LocationSearch from '@/components/LocationSearch';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/lib/data';

export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  useEffect(() => {
    const role = user?.publicMetadata.role;
    console.log('Role' + role);
    if (isSignedIn) {
    }
    if (role == UserRole.Owner) {
      router.push(`/owner`);
    } else if (role == UserRole.Tenant) {
      router.push(`/tenant`);
    }
  }, [user, router]);
  return (
    <div>
      <Navbar />
      {/* Hero section with search */}
      <div className="bg-green-100 py-8 md:py-16 lg:py-16">
        <div className="max-w-xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-green-900 mb-4 text-center md:text-5xl">
            Explore Decentralized Rentals with MyRumah
          </h1>
          <p className="text-xl text-green-700 mb-8 text-center md:text-2xl">
            Discover trusted rentals powered by blockchain technology for
            transparent, secure, and hassle-free agreements.
          </p>
          <div className="flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden bg-white">
            <LocationSearch></LocationSearch>
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
