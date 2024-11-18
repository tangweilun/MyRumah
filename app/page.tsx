'use client';

import { UserRole } from '@prisma/client';
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";

// Define the types for the property
interface PropertyInfo {
  property_id: number;
  owner_id: number;
  address: string;
  image: string; // This will be a base64 image string
  description: string;
  occupant_num: number;
  rental_fee: number;
  start_date: string;
  end_date: string;
  status: "active" | "inactive" | "occupied" | "trash";
  created_date: string;
  modified_date: string;
  owner: {
    user_id: number;
    username: string;
    email: string;
  };
}

export default function Home() {
  // Define state for multiple fields
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [userRole, setRole] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Property state
  const [properties, setProperties] = useState<PropertyInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Handle form submit for registration
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const userData = { username, email, phoneNumber, userRole, password };

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    if (result.status === 200) {
      console.log(result.message);
      console.log(result.newUser);
      alert('User registered successfully!');
    } else {
      console.error(result.message);
      alert('Error occurred when registering user.');
    }
  };

  // Fetch properties data when component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/property/read');  // Adjust API route if needed
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        setProperties(data.properties);  // Assuming `properties` is the key holding the data
      } catch (err) {
        setError("An error occurred while fetching properties.");
        console.error(err);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div>
      {/* User Registration Form */}
      <h1>Add User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>

        <div>
          <label htmlFor="role">Role</label>
          <input
            type="text"
            id="role"
            value={userRole}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRole(e.target.value)}
            placeholder="Enter role"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>

      {/* Error handling if data fetching fails */}
      {error && <div>{error}</div>}

      {/* Property List */}
      <h1>Property List</h1>
      <div>
        {properties.length === 0 ? (
          <p>No properties available.</p>
        ) : (
          properties.map((property) => (
            <div key={property.property_id} className="property-card">
              <img
                src={`data:image/png;base64,${property.image}`}
                alt={property.address}
                className="property-image"
                style={{ width: "200px", height: "auto" }}
              />
              <h2>{property.address}</h2>
              <p>{property.description}</p>
              <p>Owner: {property.owner.username}</p>
              <p>Occupants: {property.occupant_num}</p>
              <p>Rental Fee: ${property.rental_fee}</p>
              <p>Status: {property.status}</p>
              <p>
                Available from {property.start_date} to {property.end_date}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}



