import Navbar from "@/components/Navbar";
import LocationSearch from "@/components/LocationSearch";
import PropertyGrid from "@/components/PropertyGrid";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-stone-50 to-stone-100">
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
