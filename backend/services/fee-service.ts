import { ethers } from "ethers";
import prisma from "../../lib/prisma";
import {
  Prisma,
  UserRole,
  RentalFeeStatus,
  AgreementStatus,
} from "@prisma/client";
import { deductWallet } from "./wallet-service";
import { chkUserRole } from "./misc-service";
import { RentalFeeContractAddress } from "../../src/utils/smartContractAddress";
import rentalFeeAbi from "../../src/abi/rentalFee.json";

const isUserRole = (role: string): role is UserRole =>
  Object.values(UserRole).includes(role as UserRole);

// async function getAllFee(userId: number, userRole: string) {

const getContract = async () => {
  const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // Local blockchain (e.g., Hardhat)
  const signer = await provider.getSigner();
  const contractAddress = RentalFeeContractAddress; // Replace with actual deployed contract address
  if (!contractAddress) {
    throw new Error(
      "Contract address (NEXT_PUBLIC_RENTAL_FEE_CONTRACT_ADDRESS) is missing."
    );
  }
  const rentalFeeContract = new ethers.Contract(
    contractAddress,
    rentalFeeAbi.abi,
    signer
  );

  return rentalFeeContract;
};

async function getAllFee(userId: number) {
  const chkRole = await chkUserRole(userId);
  if (chkRole.status != 200 || !chkRole.userRole) {
    return { status: chkRole.status };
  }

  const tenantFindManyQuery: Prisma.RentalFeeFindManyArgs = {
    where: {
      agreement: {
        proposal: {
          tenant_id: userId,
        },
      },
    },
    include: {
      agreement: true,
    },

    orderBy: [{ status: "asc" }, { created_date: "desc" }],
  };

  const ownerFindManyQuery: Prisma.RentalFeeFindManyArgs = {
    where: {
      agreement: {
        proposal: {
          property: {
            owner_id: userId,
          },
        },
      },
    },
    include: {
      agreement: true,
    },

    orderBy: [{ status: "asc" }, { created_date: "desc" }],
  };

  let currFindManyQuery = null;

  if (chkRole.userRole === UserRole.tenant) {
    currFindManyQuery = tenantFindManyQuery;
  } else if (chkRole.userRole === UserRole.owner) {
    currFindManyQuery = ownerFindManyQuery;
  }

  // due to not matched user role
  if (!currFindManyQuery) {
    return { status: 401 };
  }

  try {
    const allFee = await prisma.rentalFee.findMany(currFindManyQuery);

    if (!allFee) {
      return { status: 404 };
    }

    return {
      status: 200,
      feeList: allFee,
    };
  } catch (error) {
    console.error("Error in retrieving rental fee list from database: ", error);
    return { status: 500 };
  }
}

// async function getSpecTenantFee(
//   tenantId: number,
//   ownerId: number,
//   userRole: string
// )
async function getSpecTenantFee(tenantId: number, ownerId: number) {
  // if (!isUserRole(userRole)) {
  //   return { status: 401 };
  // }

  const chkRole = await chkUserRole(ownerId);
  if (chkRole.status != 200 || !chkRole.userRole) {
    return { status: chkRole.status };
  }

  if (chkRole.userRole !== UserRole.owner) {
    return { status: 403 };
  }

  try {
    const specTenantFee = await prisma.rentalFee.findMany({
      where: {
        agreement: {
          proposal: {
            tenant_id: tenantId,
            property: {
              owner_id: ownerId,
            },
          },
        },
      },
      include: {
        agreement: true,
      },
      orderBy: [{ status: "asc" }, { created_date: "desc" }],
    });

    if (!specTenantFee) {
      return { status: 404 };
    }

    return {
      status: 200,
      specTenantFee: specTenantFee,
    };
  } catch (error) {
    console.error(
      "Error in retrieving rental fee list of specific tenant from database: ",
      error
    );
    return { status: 500 };
  }
}

async function getSpecFee(feeId: number) {
  try {
    const specFee = await prisma.rentalFee.findUnique({
      where: {
        fee_id: feeId,
      },
      include: {
        agreement: {
          include: {
            proposal: {
              select: {
                tenant_id: true,
              },
            },
          },
        },
      },
    });

    if (!specFee) {
      return { status: 404 };
    }

    // const rentalFeeContract = await getContract();
    // const getFeeTx = await rentalFeeContract.getFee(specFee.fee_id);
    // console.log(getFeeTx);

    return { status: 200, specFee: specFee };
  } catch (error) {
    console.error(
      "Error in retrieving specified rental fee from database: ",
      error
    );
    return { status: 500 };
  }
}

async function createFee(agreementId: number) {
  if (!agreementId) {
    return { status: 400 };
  }
  try {
    const agreement = await prisma.agreement.findUnique({
      where: {
        agreement_id: agreementId,
        // agreement_status: "ongoing",
      },
      include: {
        proposal: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!agreement) {
      return { status: 404 };
    }

    if (agreement.agreement_status !== AgreementStatus.ongoing) {
      return { status: 400 };
    }

    // check if fees of specific agreement are already created before
    const prevFee = await prisma.rentalFee.findFirst({
      where: {
        agreement_id: agreementId,
      },
    });

    if (prevFee) {
      return { status: 409 };
    }

    const startDate = agreement.proposal.property.start_date;
    const endDate = agreement.proposal.property.end_date;
    const rentalFee = agreement.proposal.property.rental_fee;

    let multipleRentalFee: Prisma.RentalFeeCreateManyInput[] = [];
    // let newFeeCreateManyQuery: Prisma.RentalFeeCreateManyArgs = {
    //   data: [] as Prisma.RentalFeeCreateManyInput[],
    // };

    const ttlMonth = await calMonth(startDate, endDate);

    for (let i = 0; i < ttlMonth; i++) {
      multipleRentalFee.push({
        agreement_id: agreementId,
        amount: rentalFee,
        status: RentalFeeStatus["pending" as keyof typeof RentalFeeStatus],
      });
    }

    const newRentalFee = await prisma.rentalFee.createManyAndReturn({
      data: multipleRentalFee,
    });

    const rentalFeeContract = await getContract();

    // same structure with the struct in smart contract
    const fees = newRentalFee.map((fee) => ({
      feeId: fee.fee_id,
      agreementId: fee.agreement_id,
      amount: fee.amount.toString(),
      status: fee.status === "paid" ? "paid" : "pending",
      createdDate: fee.created_date.toString(),
    }));

    console.log(fees);

    const createFeeTx = await rentalFeeContract.createFee(fees);

    console.log(createFeeTx);

    return { status: 200, newRentalFee: newRentalFee };
  } catch (error) {
    console.error("Error in creating new rental fee: ", error);
    return { status: 500 };
  }
}

async function payFee(feeId: number, userId: number) {
  const chkRole = await chkUserRole(userId);
  if (chkRole.status != 200 || !chkRole.userRole) {
    return { status: chkRole.status };
  }

  if (chkRole.userRole !== UserRole.tenant) {
    return { status: 403 };
  }

  try {
    const specFee = await getSpecFee(feeId);
    if (specFee.status !== 200 || !specFee.specFee) {
      return { status: specFee.status };
    }

    if (specFee.specFee.status !== RentalFeeStatus.pending) {
      return { status: 400 };
    }

    const tenantId = specFee.specFee.agreement.proposal.tenant_id;
    const payableAmount = Number(specFee.specFee.amount);

    // deductWallet function is came from "user-service.tsx"
    const updatedWallet = await deductWallet(tenantId, payableAmount);

    if (updatedWallet.status !== 200 || !updatedWallet.updatedUserData) {
      return { status: updatedWallet.status };
    }

    const paidFee = await prisma.rentalFee.update({
      where: {
        fee_id: feeId,
      },
      data: { status: RentalFeeStatus["paid" as keyof typeof RentalFeeStatus] },
    });

    const rentalFeeContract = await getContract();

    // same structure with the struct in smart contract
    const fee = {
      feeId: paidFee.fee_id,
      agreementId: paidFee.agreement_id,
      amount: paidFee.amount.toString(),
      status: paidFee.status,
      createdDate: paidFee.created_date.toString(),
    };

    const payFeeTx = await rentalFeeContract.payFee(fee);
    console.log(payFeeTx);

    return { status: 200, paidFee: paidFee };
  } catch (error) {
    console.error("Error in paying rental fee: ", error);
    return { status: 500 };
  }
}

async function calMonth(startDate: Date, endDate: Date) {
  if (startDate > endDate) {
    throw new Error("Start date must be before or equal to end date");
  }

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth(); // 0-based index
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  // Calculate the difference in months (including start month)
  const months = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

  return months;
}

export { getAllFee, getSpecTenantFee, getSpecFee, createFee, payFee };
