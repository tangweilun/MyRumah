'use client';

import Navbar from '@/components/Navbar';
import { MapPin, Search } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';


// Importing PropertyInfo interface
export interface PropertyInfo {
  ownerId: number;
  address: string;
  description: string;
  occupant_num: number;
  rental_fee: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'occupied' | 'trash';
  image: File | null; // Image file
}

export default function Home() {
  const [formData, setFormData] = useState<PropertyInfo>({
    ownerId: 0,
    address: '',
    description: '',
    occupant_num: 0,
    rental_fee: 0,
    startDate: '',
    endDate: '',
    status: 'active',
    image: null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [properties, setProperties] = useState<PropertyInfo[]>([]); // State to hold the list of properties
  console.log(properties);
  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setPreviewImage(URL.createObjectURL(file)); // Generate image preview
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure ownerId, occupantNum, and rentalFee are numbers
    const ownerId = Number(formData.ownerId);
    const occupantNum = Number(formData.occupant_num);
    const rentalFee = Number(formData.rental_fee);

    // Create the propertyData object with the expected structure
    const propertyData = {
      ownerId,
      address: formData.address,
      description: formData.description,
      occupantNum,
      rentalFee,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
    };

    if (formData.image) {
      // Convert the image to base64 string
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        // Add the image as a base64 string to the propertyData
        const dataToSend = {
          ...propertyData,
          image: base64Image, // Include the image as base64 string
        };

        try {
          const response = await fetch('/api/property', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend), // Send JSON data
          });

          const result = await response.json();
          if (response.status === 200) {
            console.log('Property created successfully:', result);
            // Reset form or show success message here
            setProperties((prev) => [...prev, result.property]); // Add the new property to the list
          } else {
            console.error('Error creating property:', result.message);
          }
        } catch (error) {
          console.error('Error submitting property:', error);
        }
      };
      reader.readAsDataURL(formData.image); // Convert the image to base64
    }
  };

  // Fetch all properties when the component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/property');
        const result = await response.json();
        console.log(result.properties[0].occupant_num);
        if (response.status === 200) {
          // console.log(properties);
          setProperties(result.properties); // Update state with the fetched properties
        } else {
          console.error('Error fetching properties:', result.message);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div>
      <Navbar></Navbar>
      {/* Hero section with search */}
      <div className="bg-green-100 py-16">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold text-green-900 mb-4 text-center">
            Explore Decentralized Rentals with MyRumah
          </h1>
          <p className="text-xl text-green-700 mb-8 text-center">
            Discover trusted rentals powered by blockchain technology for
            transparent, secure, and hassle-free agreements.
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

      {/* Property Info Form */}
      <div className="max-w-2xl mx-auto my-10">
        <h2 className="text-2xl font-bold mb-6">Add Property Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields (same as in your original code) */}
          <div>
            <label>Owner ID:</label>
            <input
              type="number"
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label>Number of Occupants:</label>
            <input
              type="number"
              name="occupantNum"
              value={formData.occupant_num}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label>Rental Fee:</label>
            <input
              type="number"
              name="rentalFee"
              value={formData.rental_fee}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label>Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="occupied">Occupied</option>
              <option value="trash">Trash</option>
            </select>
          </div>
          <div>
            <label>Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          {previewImage && (
            <div>
              <h3>Image Preview:</h3>
              <img src={previewImage} alt="Preview" className="max-w-full rounded" />
            </div>
          )}
          <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white">
            Submit Property
          </Button>
        </form>
      </div>

      {/* Display Properties List */}
      <div className="max-w-2xl mx-auto my-10">
  <h2 className="text-2xl font-bold mb-6">Property Listings</h2>
  <div className="space-y-4">
    {properties.map((property, index) => (
      <div key={index} className="border p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold">{property.address}</h3>
        <p>{property.description}</p>
        <p>Status: {property.status}</p>
        
        {/* Rental Fee: Handle NaN */}
        <p>Rental Fee: ${Number(property.rental_fee)}</p>
        
        {/* Occupants: Handle missing or null value */}
        <p>Occupants: {property.occupant_num}</p>
        
        {/* Dates: Handle invalid date */}
        <p>Start Date: {new Date(property.startDate).toLocaleDateString() || 'Invalid Date'}</p>
        <p>End Date: {new Date(property.endDate).toLocaleDateString() || 'Invalid Date'}</p>
        
        {/* Image rendering */}
        {property.image ? (
          <Image 
            src={`data:image/jpeg;base64,${Buffer.from(property.image).toString('base64')}`} 
            alt="Property Image" 
            width={200} 
            height={200} 
          />
        ) : (
          <p>No image available</p> 
        )}
      </div>
    ))}
  </div>
</div>


    </div>
  );
}
