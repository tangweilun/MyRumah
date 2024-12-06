# MyRumah

## Overview

This project is a Web3-based real estate system that allows property owners and tenants to interact transparently. It leverages blockchain for secure transactions and provides a modern frontend interface for seamless usability.

## Assets

![](attachment/asset1.png)
![](attachment/asset2.png)
![](attachment/asset3.png)
![](attachment/asset4.png)
![](attachment/asset5.png)
![](attachment/asset6.png)
![](attachment/asset7.png)
![](attachment/asset8.png)
![](attachment/asset9.png)
![](attachment/asset10.png)
![](attachment/asset11.png)
![](attachment/asset12.png)
![](attachment/asset13.png)
![](attachment/asset14.png)

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

**Starting application**:

- After the hardhat is restart and rerun the application, the application will fetch the data of agreement and rental fee from database to blockchain.

**Proposal**:

- Tenant cannot propose the property that having start date >= current date.
- Tenant cannot propose same property if there are proposal on same property is exist and is in pending status.
- Tenant cannot propose same property if there are proposal on same property is exist and relevant agreement is in pedning/ongoing status.
- When tenant or owner change proposal status, if current date is >= the relevant property's start date, the status will be changed to "cancelled".

**Rental Agreement**:

- Auto generated once the proposal is approved.
- Agreement period is based on the start date and end date of property.
- Include deposit payment and return.
- Automatic expiration for unsigned agreements after 7 days.
- The agreement status will changed to completed if deposit is returned.
- Whenever the agreement is create or updated, it will be saved into blockchain via smart contract "AgreementContract"

**Rental Fee**:

- After agreement is signed by both parties and deposit is paid, will generate rental fee based on agreement duration
- Whenver the rental fee is created or updated (paid), it will be saved into blockchain via smart contract "RentalFee"

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

---

# Setup

## First step

1. Open a terminal and run 'npm install' to install all the dependency for the project
   
   ```bash
   npm install
   ```

## Second step (primsa/database setup)

### PostgreSQL Installation

- Please install postgreSQL thorugh this URL [PostgreSQL: Downloads](https://www.postgresql.org/download/)[PostgreSQL: Downloads](https://www.postgresql.org/download/)
  
  ![](attachment/2024-12-04-21-38-55-image.png)
  
  ![](attachment/2024-12-04-21-40-11-image.png)
  
  ![](attachment/2024-12-04-21-42-40-image.png)
  
  - After clicking the URL, it will lead you to the website shown in the figure above.
  
  - Then select the operating system that your laptop or computer is using.
  
  - If you select Windows, it will lead you to another page and click the **Download the installer** .
  
  - Then, it will lead you to another page and click the download icon under the Windows x86-64 to start downloading the postgreSQL installer.
  
  - After finish downloading the installer, please click the installer to start the installation
    
    ![](attachment/2024-12-04-21-50-31-image.png)
    
    - This will be shown after you click the postgreSQL installer
      
      ![](attachment/2024-12-04-21-57-23-image.png)
      
      ![](attachment/2024-12-04-22-00-17-image.png)
    
    - After you have click several next button you will be lead to the process shown above where you need to input your password for the superuser that will be very important in the setup process later.
    
    - The port shown above will also be important and will be explained in the following content.
    
    - The inputted password will be used in the pgAdmin and be inlcuded in the DATABASE_URL in the env file which will be explained in the following content.
    
    - After this just click next until the postgreSQL installation is complete.
      
      ### Please remember the password you inputted during this process.
      
      ![](attachment/2024-12-04-22-07-48-image.png)
    
    - After finish installing the postgreSQL, it will lead to this part and select the PostgreSQL 17 (x64) on port 5432 as it is the port that you choose while installing the PostgreSQL.
      
      ![](attachment/2024-12-06-14-02-37-image.png)
    
    - Then select the applications as shown in figure above to be installed.
    
    - Then just click next until the installation is completed.
    
    - However if there are something wrong, just include all applications

## pgAdmin Installation

- Please click this URL [Download](https://www.pgadmin.org/download/)

![](attachment/2024-12-04-22-23-40-image.png)

- Same select your operating system

- If you select Windows, please click it

![](attachment/2024-12-04-22-24-30-image.png)

- Please select the latest version v8.13

![](attachment/2024-12-04-22-25-11-image.png)

- Select the pgAdmin4-8.13-x64.exe installer, click it and it will start downloading the pgAdmin installer

- After finish downloading the pgAdmin installer, click it and start the pgAdmin installation

![](attachment/2024-12-04-22-29-08-image.png)

- Select install for me only

![](attachment/2024-12-04-22-29-33-image.png)

- Just click next button and follow the steps

![](attachment/2024-12-04-22-30-12-image.png)

- Click I accpet the agreement and continue click next button until the installation is finish

#### Create server

![](attachment/2024-12-04-22-41-01-image.png)

- Open your pgAdmin application then click **add new server**

![](attachment/2024-12-04-22-42-39-image.png)

- Then put the name as MyRumah as shown above

- Then go to the **Connection**

![](attachment/2024-12-04-22-50-16-image.png)

- Follow the configuration as shown above and click the **Save** button

- The password use the password you inputted when you installing the postgreSQL

## NOTE (DATABASE_URL)

1. Ensure that you have install postgresql and pgAdmin to act as your local database
2. Ensure that you have add the server in the pgAdmin such as the username and password for DATABASE_URL
3. Ensure that your DATABASE_URL is being setup properly in your .env file as below

DATABASE_URL="postgresql://postgres:admin12345@localhost:5432/MyRumah?schema=public" This is a sample

- As shown in the pgAdmin installation and based on the reference below, the corresponding info will be shown below:

- USER = postgres

- PASSWORD = admin12345 (the password you inputted during the postgreSQL installation)

- HOST = localhost

- PORT = 5432

- DATABASE_NAME = MyRumah

- All info will need to follow the info that you have inputted during the add new server process

DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public" This is the reference

## Ensure that you have paste the corresponding info to the DATABASE_URL in the .env file when creating the database/server (MyRumah) in pgAdmin

![](attachment/2024-12-04-23-08-51-image.png)

## Prisma and database Setup

1. Open a terminal and run 'npm run prisma:setup'
   
   ```bash
   npm run prisma:setup
   ```

## NOTE (npm run prisma:setup)

This command has been configured in the package.json scripts as below

```typescript
"scripts": {
"dev": "ts-node backend/scripts/syncAll.ts && next dev",
"build": "next build",
"start": "next start",
"lint": "next lint",
"prisma:migrate": "npx prisma migrate dev --name myrumah_migration",
"prisma:generate": "npx prisma generate",
"prisma:seed": "npx ts-node prisma/seed.ts",
"prisma:setup": "npm run prisma:migrate && npm run prisma:generate && npm run prisma:seed"
}
```

- The prisma:migrate is to run and apply the migration

- The prisma:generate is to create the prisma client for database linkage and allow CRUD interaction with the local database

- The prisma:seed is to auto-create fake data and insert into local database based on the seed.ts in the prisma folder

- The prisma:setup is to compile all the prisma command and run it all at once

If you want to manually run the command run by one can refer to the scripts attached above

## Prisma setup NOTE

1. If you want to reset the database can run 'npx prisma migrate reset' but please ensure there is migration file under migrations folder under primsa folder
2. Ensure that the migration file under the migrations folder under the prisma folder is called myrumah_migration as it is the latest migration if it is not please delete it and run 'npm run prisma:migrate' to create and run the correct migration.

## Smart Contract

Follow these steps to setup the smart contract environment

1. Open a terminal

2. Run 'cd backend' to enter backend site
   
   ```bash
   cd backend
   ```

3. Run 'npm install --save-dev hardhat' to install the hardhat
   
   ```bash
   npm install --save-dev hardhat
   ```

4. Run 'npx hardhat node' to setup the network
   
   ```bash
   npx hardhat node
   ```

5. To update the addresses, open a new terminal, enter backend site by running 'cd backend', then run 'npm run deploy'
   
   ```bash
   cd backend
   npm run deploy
   ```

### Smart Contract Note (Overview)

1. In the env file there will be NEXT_PUBLIC_AGREEMENT_CONTRACT_ADDRESS and NEXT_PUBLIC_RENTAL_FEE_CONTRACT_ADDRESS which will be the smart contract address for rental fee and agreement.

![](attachment/2024-12-04-23-16-31-image.png)

1. When running the 'npm run deploy' the addresses will be updated and will be shown in the terminal to show that both of the addresses have been updated

2. ![](attachment/2024-12-04-23-17-05-image.png)It is a must to run 'npx hardhat node' to setup the network for the smart contract

## Run dev

## Ensure that you have exit the backend site by running 'cd..'

```bash
cd..
```

1. Open a terminal and run 'npm run dev' to start using the system

```bash
npm run dev
```

![](attachment/2024-12-04-23-17-30-image.png)

# Additional Note

## ERD

![](attachment/2024-12-06-16-54-48-image.png)

## Github Link

https://github.com/tangweilun/MyRumah
