import { ethers } from "ethers";
import dotenv from "dotenv";
import { fetchFeeRecords, sendToBlockchain } from "./utils/syncUtils";
import { RentalFeeContractAddress } from "../../src/utils/smartContractAddress";
import rentalFeeAbi from "../../src/abi/rentalFee.json";

dotenv.config();

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

async function syncRentalFee() {
  const feeRecords = await fetchFeeRecords("rentalFee");
  console.log(feeRecords);
  if (feeRecords.length === 0) {
    console.log("No fee records in database.");
    return;
  }
  const rentalFeeContract = await getContract();
  const fees = feeRecords.map(
    (fee: {
      fee_id: number;
      agreement_id: number;
      amount: string;
      status: string;
      created_date: string;
    }) => ({
      feeId: fee.fee_id,
      agreementId: fee.agreement_id,
      amount: fee.amount.toString(),
      status: fee.status === "paid" ? "paid" : "pending",
      createdDate: fee.created_date.toString(),
    })
  );
  console.log("Type is: " + typeof fees[0].feeId);
  console.log("Type is: " + typeof fees[0].agreementId);
  console.log("Type is: " + typeof fees[0].amount);
  console.log("Type is: " + typeof fees[0].status);
  console.log("Type is: " + typeof fees[0].createdDate);
  console.log("Next fee\n");
  console.log("Type is: " + typeof fees[1].feeId);
  console.log("Type is: " + typeof fees[1].agreementId);
  console.log("Type is: " + typeof fees[1].amount);
  console.log("Type is: " + typeof fees[1].status);
  console.log("Type is: " + typeof fees[1].createdDate);
  console.log(fees);

  await sendToBlockchain(rentalFeeContract, "createFee", fees);
}

syncRentalFee();
