'use client';
import React from 'react';
import { useState } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

const locations = [
  {
    value: 'klcc',
    label: 'KLCC, Kuala Lumpur',
    description: 'City Center - Shopping & Twin Towers',
  },
  {
    value: 'bukitbintang',
    label: 'Bukit Bintang, Kuala Lumpur',
    description: 'Shopping & Entertainment District',
  },
  {
    value: 'bangsarsouth',
    label: 'Bangsar South, Kuala Lumpur',
    description: 'Modern Business & Residential Area',
  },
  {
    value: 'montkiara',
    label: 'Mont Kiara, Kuala Lumpur',
    description: 'Upscale Residential Area',
  },
  {
    value: 'cheras',
    label: 'Cheras, Kuala Lumpur',
    description: 'Residential & Commercial District',
  },
  {
    value: 'damansara',
    label: 'Damansara Heights, Kuala Lumpur',
    description: 'Premium Residential Area',
  },
  {
    value: 'pj',
    label: 'Petaling Jaya, Selangor',
    description: 'Major Satellite City',
  },
  {
    value: 'subang',
    label: 'Subang Jaya, Selangor',
    description: 'Popular Suburban Area',
  },
  {
    value: 'ampang',
    label: 'Ampang, Kuala Lumpur',
    description: 'Embassy District & Residential Area',
  },
];

const LocationSearch = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Searching for:', value);
    }, 100);
  };

  const filteredLocations = locations.filter(
    (location) =>
      location.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl mx-auto">
      <div className="relative flex-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-start text-left border-2 focus:border-green-700 focus:ring-green-700"
            >
              <MapPin className="h-5 w-5 text-stone-400 mr-2" />
              {value || 'Search in Kuala Lumpur...'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <div className="flex flex-col">
              <div className="p-2 border-b">
                <Input
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 focus:border-green-700 focus:ring-green-700"
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {filteredLocations.length === 0 ? (
                  <div className="p-4 text-sm text-stone-500 text-center">
                    No location found.
                  </div>
                ) : (
                  <div className="p-2">
                    <div className="text-sm font-medium text-stone-500 px-2 py-1">
                      Popular Areas
                    </div>
                    {filteredLocations.map((location) => (
                      <button
                        key={location.value}
                        onClick={() => {
                          setValue(location.label);
                          setSearchTerm('');
                          setOpen(false);
                        }}
                        className="w-full text-left px-2 py-2 hover:bg-stone-100 rounded-md transition-colors"
                      >
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-stone-400 mr-2" />
                          <span className="font-medium">{location.label}</span>
                        </div>
                        <span className="text-sm text-stone-500 ml-6">
                          {location.description}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Button
        size="lg"
        className="bg-green-700 hover:bg-green-800 text-white min-w-[120px]"
        onClick={handleSearch}
        disabled={loading || !value}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        ) : (
          <Search className="h-5 w-5 mr-2" />
        )}
        Search
      </Button>
    </div>
  );
};

export default LocationSearch;
