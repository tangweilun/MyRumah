'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

export default function Home() {
  // Define state for multiple fields
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Collect all input data into an object
    const userData = {
      username,
      email,
      phoneNumber,
      role,
      password,
    };

    // Send the data to the API
    // const response = await fetch('/api/add-user', {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(userData), // Pass the entire object
    // });

    // const result = await response.json();
    // if (result.status === 'success') {
    //   console.log('User added successfully:', result.newUser);
    //   alert('User added successfully!');
    // } else {
    //   console.error('Error:', result.message);
    //   alert('Failed to add User.');
    // }

    // testing GET method
    //
    const response = await fetch(`/api/add-user`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    if (result.status === 'success') {
      console.log('User get successfully:', result.message);
      alert('User get successfully!');
    } else {
      console.error('Error:', result.message);
      alert('Failed to get User.');
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
          {/* <select
            id="role"
            value={role}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setRole(e.target.value)
            }
          >
            <option value="tenant">Tenant</option>
            <option value="owner">Owner</option>
          </select> */}
          <input
            type="text"
            id="role"
            value={role}
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
