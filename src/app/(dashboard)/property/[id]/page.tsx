'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import {
  Edit2,
  Eye,
  Trash2,
  Wifi,
  Car,
  ChefHat,
  Camera,
  Users,
  Bed,
  DollarSign,
  MapPin,
  Calendar,
  Clock,
} from 'lucide-react';
import Image from 'next/image';
import PropertyGallery from '@/components/PhotoGallery';

// Previous property details content remains the same
const proposals = [
  {
    id: 1,
    name: 'Alice Johnson',
    property: 'Sunset Apartments, Unit 301',
    duration: '12 months',
    rate: '$1,500/month',
    submitted: 'Submitted 2 days ago',
    status: 'Pending',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: 2,
    name: 'Bob Smith',
    property: 'Oakwood Residences, Unit 205',
    duration: '6 months',
    rate: '$1,200/month',
    submitted: 'Submitted 1 week ago',
    status: 'Approved',
    avatar: '/placeholder.svg?height=40&width=40',
  },
];

const SingleProperyPage = () => {
  const router = useRouter();
  const propertyId = '1'; // Replace with the actual property ID

  return (
    <div className="px-16 py-8 bg-stone-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-green-800">
          Cozy Cottage in the Woods
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-green-600"
            onClick={() => router.push(`${window.location.pathname}/edit`)} // Navigate to the edit page
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Property
          </Button>
          <Button variant="outline" className="text-orange-600">
            <Eye className="h-4 w-4 mr-2" />
            Hide Property
          </Button>
          <Button variant="outline" className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Property
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="">
        <TabsList className="grid w-fit grid-cols-2 mb-6">
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
        </TabsList>

        {/* Previous Property Details TabsContent remains the same */}
        <TabsContent value="details">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Property Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      A charming cottage nestled in the woods, perfect for a
                      peaceful getaway. Features a cozy fireplace and a
                      wraparound porch with stunning forest views.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium mb-2">Details</h3>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Sleeps 4 guests</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Bed className="h-4 w-4" />
                        <span>2 bedrooms</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>$95 per night</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Woodsville, CA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    <span>Free WiFi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span>Free parking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-4 w-4" />
                    <span>Full Kitchen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    <span>Security cameras</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <PropertyGallery></PropertyGallery>
        </TabsContent>

        <TabsContent value="proposals">
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Image
                        src={proposal.avatar}
                        alt={proposal.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{proposal.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {proposal.property}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        proposal.status === 'Pending' ? 'outline' : 'secondary'
                      }
                      className="ml-auto"
                    >
                      {proposal.status}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {proposal.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      {proposal.rate}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {proposal.submitted}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/property/${proposal.id}`)} // Navigate to the specific property page
                    >
                      View Details
                    </Button>
                    {proposal.status === 'Pending' && (
                      <>
                        <Button variant="destructive" size="sm">
                          Reject
                        </Button>
                        <Button variant="default" size="sm">
                          Approve
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SingleProperyPage;
