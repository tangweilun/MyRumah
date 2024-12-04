import { ethers } from "ethers";
import dotenv from "dotenv";
import { fetchAgreementRecords, sendToBlockchain } from "./utils/syncUtils";
import { AgreementContractAddress } from "../../src/utils/smartContractAddress";
import agreementAbi from "../../src/abi/agreementContract.json";

dotenv.config();

const getAgreementContract = async () => {
  const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // Local blockchain (e.g., Hardhat)
  const signer = await provider.getSigner();
  const contractAddress = AgreementContractAddress; // Replace with actual deployed contract address
  if (!contractAddress) {
    throw new Error(
      "Contract address (NEXT_PUBLIC_AGREEMENT_CONTRACT_ADDRESS) is missing."
    );
  }
  const agreementContract = new ethers.Contract(
    contractAddress,
    agreementAbi.abi,
    signer
  );

  return agreementContract;
};

async function syncAgreement() {
  const agreementRecords = await fetchAgreementRecords("agreement");
  if (agreementRecords.length === 0) {
    console.log("No agreement records in database.");
    return;
  }
  const agreementContract = await getAgreementContract();
  const agreements = agreementRecords.map(
    (agreement: {
      agreement_id: number;
      proposal_id: number;
      content: string;
      deposit: string;
      deposit_status: string;
      agreement_status: string;
      tenant_signature: boolean;
      owner_signature: boolean;
      created_date: string;
      modified_date: string;
    }) => ({
      proposalId: agreement.proposal_id,
      content: agreement.content,
      deposit: agreement.deposit.toString(),
      rentalFee: "0", // Placeholder if rental fee is not included in the schema
      depositStatus: agreement.deposit_status,
      agreementStatus: agreement.agreement_status,
    })
  );

  console.log("Synchronizing agreements...");
  for (const agreement of agreements) {
    const tx = await agreementContract.createAgreement(
      agreement.proposalId,
      agreement.content,
      agreement.deposit,
      agreement.depositStatus,
      agreement.agreementStatus
    );
    console.log(`Agreement synchronized: ${tx.hash}`);
  }
}

syncAgreement();
