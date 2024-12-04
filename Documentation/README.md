# MyRumah

## Overview

This project is a Web3-based real estate system that allows property owners and tenants to interact transparently. It leverages blockchain for secure transactions and provides a modern frontend interface for seamless usability.

## Features

### Common Features

- **Register/Login**: Role-based authentication for Owners and Tenants.
- **Topup/Deduct Wallet**: Owners and Tenants can manually topup wallet, Wehre the execution of agreement, and fee payment wll automatically topup/deduct relevant party's wallet .

### Owner-Specific Features

- **Property Management**:
  - Add, edit, delete, or hide property listings.
  - Include essential property information such as address, owner id, contact, and property image.
- **Proposal Management**:
  - View and manage proposal statuses (can approve or reject proposal if it is in pending status).
- **Tenant Management**:
  - View tenants, proposals, and fee details per tenant that related to currrent owner.
- **Agreement Management**:
  - Review and sign agreements.
- **Fee Listing**:
  - View fee statuses (Paid, Pending).

### Tenant-Specific Features

- **Property Browsing**:
  - View and filter property listings.
- **Proposal Submission**:
  - Submit property rental proposals.
  - View Manage proposal statuses (change status from pending to cancelled).
- **Agreement Management**:
  - Review and sign agreements after owner signed.
  - Pay deposit.
  - Receive returned deposit after agreement end.
- **Fee Management**:
  - Pay pending fees and view payment history.

### Feature Note

**Proposal**:

- Tenant cannot proposed the property that having start date >= current date.
- Tenant cannot propose same property if there are proposal on same property is exist and is in pending status.
- Tenant cannot propose same property if there are proposal on same property is exist and relevant agreement is in pedning/ongoing status.
- When tenant or owner change proposal status, if current date is >= the relevant property's start date, the status will be changed to "cancelled".

**Rental Agreement**:

- Auto generated once the proposal is approved.
- Agreement period is based on the start date and end date of property.
- Include deposit payment and return.
- Automatic expiration for unsigned agreements after 7 days.
- The agreement status will changed to completed if deposit is returned.

---

## Tools and Technologies

### Programming Languages

- **Solidity**: For writing smart contracts
- **JavaScript/TypeScript**: For developing the frontend and backend logic

### Frameworks and Libraries

- **Next.js**: For building the frontend and server-side rendering
- **Auth.js**: For authentication in Next.js
- **Shadcn UI**: For a customizable UI framework
- **TanStack**: For state management and data fetching
- **Zod**: For schema validation
- **Prisma**: For ORM (Object-Relational Mapping)
- **bcrypt**: For password hashing and securing sensitive user data

### Blockchain and Web3

- **Ethereum**: For deploying smart contracts
- **Ethers.js**: For interacting with the blockchain

### Databases

- **PostgreSQL**: The database used for storing application data
- **Prisma**: ORM for interacting with PostgreSQL

### Tools and Platforms

- **Hardhat**: For compiling, deploying, and testing smart contracts

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/project-name.git
   cd project-name blablabla
   ```

---

## Setup

## Smart Contract

Follow these steps to setup the smart contract environment

1. Open a terminal
2. Run 'cd backend' to enter backend site
3. Run 'npx hardhat node' to setup the network
4. To update the addresses, open a new terminal, enter backend site by running 'cd backend', then run 'npm run deploy'

### Smart Contract Note (Overview)

1. In the env file there will be NEXT_PUBLIC_AGREEMENT_CONTRACT_ADDRESS and NEXT_PUBLIC_RENTAL_FEE_CONTRACT_ADDRESS which will be the smart contract address for rental fee and agreement.
2. When running the 'npm run deploy' the addresses will be updated and will be shown in the terminal to show that both of the addresses have been updated
3. It is a must to run 'npx hardhat node' to setup the network for the smart contract
