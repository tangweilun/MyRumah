import prisma from '../../lib/prisma'; // Ensure Prisma is set up properly
import { UserRole } from '@prisma/client';

// need install bcrypt to do salting and hashing
// npm install bcryptjs

import bcrypt from 'bcryptjs';

// All function with no export is set as private function by default

// a Type Guard to check the role match with Enum value or not
const isUserRole = (role: string): role is UserRole =>
  Object.values(UserRole).includes(role as UserRole);

async function register(
  username: string,
  password: string,
  email: string,
  phoneNumber: string,
  userRole: string
) {
  if (!username || !email || !password || !phoneNumber || !userRole) {
    return { status: 400 };
  }

  // Check if the provided userRole matches one of the Role enum values
  if (!isUserRole(userRole)) {
    return { status: 401 };
  }

  const accExist = await checkAccExist(email, userRole);

  if (accExist && !accExist.exist) {
    // return { status: "success", data: "sss" };
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await prisma.userInfo.create({
        data: {
          username: username,
          password: hashedPassword,
          email: email,
          phone_number: phoneNumber,
          role: UserRole[userRole as keyof typeof UserRole],
          wallet_amount: 1000,
        },
      });
      // console.log("User created in database:", newUser);
      return {
        status: 200,
        newUser: newUser,
      };
    } catch (error) {
      console.error('Error creating user in database:', error);
      return { status: 500 };
    }
  }
  return { status: 409 };
}

async function login(email: string, userRole: string, password: string) {
  if (!email || !userRole || !password) {
    return { status: 400 };
  }

  if (!isUserRole(userRole)) {
    return { status: 401 };
  }

  const accExist = await checkAccExist(email, userRole);

  if (accExist && accExist.exist) {
    try {
      const userData = await prisma.userInfo.findUnique({
        // unique key name is defined in prisma.schema
        where: { emailRole: { email: email, role: userRole } },
      });
      if (password && userData) {
        const passwordMatches = await bcrypt.compare(
          password,
          userData.password
        );
        return passwordMatches
          ? { status: 200, userData: userData }
          : { status: 401 };
      }
      return { exist: false };
    } catch (error) {
      // console.error('Error with Prisma query:', error);
      console.error('Error with Prisma query');
      return { status: 500 };
    }
  }
  return { status: 401 };
}

async function checkAccExist(email: string, role: UserRole) {
  try {
    const count = await prisma.userInfo.count({
      where: { email: email, role: role },
    });
    return count > 0 ? { exist: true } : { exist: false };
  } catch (error) {
    // console.error('Database error');
    // throw new Error('Database error');
    console.error('Database error');
    return { status: 500 };
  }
}

export { register, login };
