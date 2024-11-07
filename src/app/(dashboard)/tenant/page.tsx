import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';

const TenantPage = () => {
  return (
    <div>
      <div className="bg-green-100 w-screen py-16">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold text-green-900 mb-4 text-center">
            Find Your Favorite Place
          </h1>
          <p className="text-xl text-green-700 mb-8 text-center">
            Discover the perfect houses and apartments for your extended stay.
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantPage;
