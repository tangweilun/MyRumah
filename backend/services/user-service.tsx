import { ethers } from 'ethers';
import prisma from '../lib/prisma'; // Assuming prisma is correctly exported
import { PrismaClient, UserRole } from '@prisma/client';



import bcrypt from 'bcryptjs';


async function register(data: { username: string,email: string,  phoneNumber: string, userRole: string, password: string }) {
  console.log("Registering user with the following details:");
  console.log(`Username: ${data.username}`);
  console.log(`Password: ${data.password}`);
  console.log(`Email: ${data.email}`);
  console.log(`Phone Number: ${data.phoneNumber}`);
  console.log(`User Role: ${data.userRole}`);

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.userInfo.create({
      data: {
        username: data.username,
        email: data.email,
        phone_number: data.phoneNumber,
        role: UserRole[data.userRole as keyof typeof UserRole],
        password: hashedPassword,
        wallet_amount: 1000,
      },
    });

    console.log('User registered successfully:', newUser);

    return {
      status: 'success',
      message: 'User registered successfully',
      user: newUser,
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      status: 'error',
      message: 'Error occurred while registering the user'+ error,
      
    };
  }
}

export { register };

