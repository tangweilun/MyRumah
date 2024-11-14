import { ethers } from 'ethers';
import prisma from '../../lib/prisma'; // Ensure Prisma is set up properly
import { Prisma, PrismaClient, UserRole } from '@prisma/client';

// need install bcrypt to do salting and hashing
// npm install bcryptjs

import bcrypt from 'bcryptjs';

// All fucntion with no export is set as private function by default

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
  // Check if the provided userRole matches one of the Role enum values
  // this will returned an array of predefined enum value: Object.values(UserRole)
  // if (!Object.values(UserRole).includes(userRole as UserRole)) {
  //   throw new Error(
  //     `Invalid role: ${userRole}. Must be one of ${Object.values(UserRole).join(
  //       ', '
  //     )}`
  //   );
  // }
  if (!isUserRole(userRole)) {
    throw new Error(
      `Invalid role: ${userRole}. Must be one of ${Object.values(UserRole).join(
        ', '
      )}`
    );
  }

  // return { status: 'success', data: 'sss' };
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
    // console.log('User created in database:', newUser);
    return { status: 200, newUser: newUser };
  } catch (error) {
    console.error('Error creating user in database:', error);
    return {
      status: 'error',
      message: 'Failed to create user. Please try again later.',
    };
  }
}

async function login(email: string, password: string) {}

async function checkAccExist(
  type: string,
  email: string,
  role: UserRole,
  password?: string
) {
  try {
    const count = await prisma.userInfo.count({
      where: { email: email, role: role },
    });

    // if type = register, check duplication email and role
    if (type === 'register') {
      return count > 0
        ? (console.log(`You have used the current email to register ${role}!`),
          false)
        : true;
    }
    // if type = login, check matching with email, role, password
    else if (type === 'login') {
      if (count > 0) {
        try {
          const user = await prisma.userInfo.findUnique({
            // unique key name is defined in prisma.schema
            where: { emailRole: { email: email, role: role } },
            select: { password: true },
          });
          if (password && user) {
            const passwordMatches = await bcrypt.compare(
              password,
              user.password
            );
            return passwordMatches ? true : false;
          }
          return false;
        } catch (error) {
          console.error('Error with Prisma query:', error);
          throw new Error('Database error');
        }
      } else if (count === 0) {
      }
    }
  } catch (error) {
    console.error('Error with Prisma query:', error);
    throw new Error('Database error');
  }
}

export { register, login };

// async function createAgreement(
//   userId,
//   document1,
//   document2,
//   tenantSigned,
//   ownerSigned,
//   status
// ) {
//   // Step 1: Set up the provider and contract
//   const provider = new ethers.JsonRpcProvider('http://localhost:8545'); // Local blockchain (e.g., Hardhat)
//   const signer = provider.getSigner();
//   const contractAddress = 'your-smart-contract-address'; // Replace with actual deployed contract address
//   const abi = [
//     'function createAgreement(uint256 userId, string memory document1, string memory document2, bool tenantSigned, bool ownerSigned, uint8 status) public returns (bytes32, uint256, string memory, string memory, bool, bool, uint8)',
//   ];
//   const contract = new ethers.Contract(contractAddress, abi, signer);

//   // Step 2: Call the smart contract to create the agreement and get the result
//   const tx = await contract.createAgreement(
//     userId,
//     document1,
//     document2,
//     tenantSigned,
//     ownerSigned,
//     status
//   );
//   const [
//     agreementHash,
//     userIdReturned,
//     document1Returned,
//     document2Returned,
//     tenantSignedReturned,
//     ownerSignedReturned,
//     statusReturned,
//   ] = tx;

//   // Step 3: Store the full agreement data in PostgreSQL
//   const newAgreement = await prisma.agreement.create({
//     data: {
//       userId: userIdReturned,
//       document1: document1Returned,
//       document2: document2Returned,
//       tenantSigned: tenantSignedReturned,
//       ownerSigned: ownerSignedReturned,
//       status: statusReturned,
//       agreementHash: agreementHash, // Store the hash in PostgreSQL too
//     },
//   });

//   console.log('Agreement created in database:', newAgreement);

//   // Step 4: Return the new agreement data
//   return { newAgreement };
// }
