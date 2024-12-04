const { PrismaClient, UserRole, PropertyStatus, ProposalStatus, DepositStatus, AgreementStatus, RentalFeeStatus } = require('@prisma/client');


const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.userInfo.create({
    data: {
      username: 'john_doe',
      password: 'password123', // In a real-world app, use proper password hashing
      email: 'john@example.com',
      phone_number: '123-456-7890',
      role: UserRole.tenant,
      wallet_amount: 100.00,
    },
  });

  const user2 = await prisma.userInfo.create({
    data: {
      username: 'jane_doe',
      password: 'password456',
      email: 'jane@example.com',
      phone_number: '987-654-3210',
      role: UserRole.owner,
      wallet_amount: 200.00,
    },
  });

  console.log('Users created:', user1, user2);

  // Create Property
  const property = await prisma.propertyInfo.create({
    data: {
      owner_id: user2.user_id,
      address: '123 Main St',
      images: [],
      description: 'Beautiful 2-bedroom apartment.',
      occupant_num: 2,
      rental_fee: 1000.00,
      start_date: new Date(),
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 6)), // 6 months from now
      status: PropertyStatus.active,
    },
  });

  console.log('Property created:', property);

  // Create Proposal
  const proposal = await prisma.proposal.create({
    data: {
      tenant_id: user1.user_id,
      property_id: property.property_id,
      status: ProposalStatus.pending,
    },
  });

  console.log('Proposal created:', proposal);

  // Create Agreement
  const agreement = await prisma.agreement.create({
    data: {
      proposal_id: proposal.proposal_id,
      content: 'Lease agreement content goes here.',
      deposit: 500.00,
      deposit_status: DepositStatus.pending,
      tenant_signature: true,
      owner_signature: false,
      agreement_status: AgreementStatus.pending,
    },
  });

  console.log('Agreement created:', agreement);

  // Create Rental Fee
  const rentalFee = await prisma.rentalFee.create({
    data: {
      agreement_id: agreement.agreement_id,
      amount: 1000.00,
      status: RentalFeeStatus.pending,
    },
  });

  console.log('Rental fee created:', rentalFee);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
