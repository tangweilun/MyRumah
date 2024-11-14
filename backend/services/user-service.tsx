import { ethers } from 'ethers';
import prisma from '../lib/prisma'; // Ensure Prisma is set up properly
import { PrismaClient, UserRole } from '@prisma/client';

// need install bcrypt to do salting and hashing
// npm install bcrypt pg

import bcrypt from 'bcrypt';

async function register(
  username: string,
  password: string,
  email: string,
  phoneNumber: string,
  userRole: string
) {
  // Check if the provided userRole matches one of the Role enum values
  // this will returned an array of predefined enum value: Object.values(UserRole)

  if (!Object.values(UserRole).includes(userRole as UserRole)) {
    throw new Error(
      `Invalid role: ${userRole}. Must be one of ${Object.values(UserRole).join(
        ', '
      )}`
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // if want to compare passwrod in the future
  // const passwordMatches = await bcrypt.compare(input password, saved password)

  try {
    const newUser = await prisma.userInfo.create({
      data: {
        username: username,
        password: hashedPassword,
        email: email,
        phone_number: phoneNumber,
        role: userRole as UserRole,
        wallet_amount: 1000,
      },
    });

    console.log('User created in database:', newUser);
    return { status: 'success', newUser };
  } catch (error) {
    console.error('Error creating user in database:', error);
    return {
      status: 'error',
      message: 'Failed to create user. Please try again later.',
    };
  }
}

export { register };

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
