import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchFeeRecords(tableName: string) {
  const allFee = await (prisma as any)[tableName].findMany();
  return allFee;
}

export async function fetchAgreementRecords(tableName: string) {
  const allAgreement = await (prisma as any)[tableName].findMany();
  return allAgreement;
}

export async function sendToBlockchain(
  contract: ethers.Contract,
  methodName: string,
  data: any
) {
  const feeRecordsFormatted = data.map(
    (fee: {
      feeId: number;
      agreementId: number;
      amount: string;
      status: string;
      createdDate: string;
    }) => [fee.feeId, fee.agreementId, fee.amount, fee.status, fee.createdDate]
  );

  const tx = await contract[methodName](feeRecordsFormatted);
  console.log(`Rental fees synchronized: ${tx.hash}`);
}
