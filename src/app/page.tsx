import Navbar from "@/components/Navbar";
import LocationSearch from "@/components/LocationSearch";
import PropertyGrid from "@/components/propertyGrid";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-stone-50 to-stone-100">
      <Navbar />
      {/* Hero section with search */}
      <div className="bg-stone-50 py-2 md:py-2 lg:py-2">
        <div className="max-w-xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-green-900 mb-4 text-center md:text-5xl">
            Explore Decentralized Rentals with MyRumah
          </h1>
          <p className="text-xl text-green-700 mb-8 text-center md:text-2xl">
            Discover trusted rentals powered by blockchain technology for
            transparent, secure, and hassle-free agreements.
          </p>
        </div>
      </div>
      {/* Properties listing */}
      <div>
        <PropertyGrid />
      </div>
    </div>
  );
}
