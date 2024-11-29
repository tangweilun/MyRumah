"use client";
import MyPropertiesGrid from "@/components/myPropertiesGrid";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Owner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddProperty = () => {
    setIsLoading(true);
    router.push("/owner/property/add");
  };

  return (
    <div className="p-16 bg-stone-50">
      {/* Card Section */}
      <h2 className="text-2xl font-bold mb-6">Owner Dashboard</h2>
      {/* My Properties Section */}
      <div className="flex items-center justify-between py-4 md:py-2">
        <h1 className="text-xl md:text-2xl font-semibold text-green-800">
          My Properties
        </h1>
        <Button
          onClick={handleAddProperty}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Loading...</span>
              <span className="sm:hidden">...</span>
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add New Property</span>
              <span className="sm:hidden">Add</span>
            </>
          )}
        </Button>
      </div>
      <MyPropertiesGrid></MyPropertiesGrid>
    </div>
  );
};

export default Owner;
