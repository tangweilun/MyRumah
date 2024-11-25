"use client";
import MetricCard from "@/components/MetricCard";
import MyPropertiesGrid from "@/components/myPropertiesGrid";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Home, Menu, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Owner = () => {
  const { data: session, status } = useSession();

  return (
    <div className="p-16 bg-stone-50">
      {/* Card Section */}
      <h2 className="text-2xl font-bold mb-6">Owner Dashboard</h2>
      <div className="flex flex-col sm:flex-row gap-16">
        <MetricCard
          title="Total Properties"
          icon={Home}
          number={5}
          description="+1 from last month"
          iconColor="text-green-700"
        />
        <MetricCard
          title="Active Bookings"
          icon={Calendar}
          number={12}
          description="+3 from last month"
          iconColor="text-green-700"
        />
        <MetricCard
          title="Total Earnings"
          icon={DollarSign}
          number="$3,240"
          description="+20% from last month"
          iconColor="text-green-700"
        />
      </div>
      {/* My Properties Section */}
      <div className="flex items-center justify-between py-4 md:py-6">
        <h1 className="text-xl md:text-2xl font-semibold text-green-800">
          My Properties
        </h1>
        <Link href="/property/add">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add New Property</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </Link>
      </div>
      <MyPropertiesGrid></MyPropertiesGrid>
    </div>
  );
};

export default Owner;
