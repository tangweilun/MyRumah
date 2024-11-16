'use client';

import { UserRole } from '@prisma/client';
import { useState, FormEvent, ChangeEvent } from 'react';

export default function Home() {
  // Define state for multiple fields
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [userRole, setRole] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Collect all input data into an object
    const userData = {
      username,
      email,
      phoneNumber,
      userRole,
      password,
    };

    // Send the data to the API
    const response = await fetch('/api/add-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData }), // Send the object wrapped in a 'userData' field
    });

    const result = await response.json();
    if (result.status === 'success') {
      console.log('User added successfully:', result.receivedData);
      alert('User added successfully!');
    } else {
      console.error('Error:', result.message);
      alert('Failed to add user.');
    }
  };

  return (
    <div>
      <h1>Add User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPhoneNumber(e.target.value)
            }
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRole(e.target.value)
            }
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            placeholder="Enter password"
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
