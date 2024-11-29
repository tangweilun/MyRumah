import { ethers } from 'ethers';

// Replace with your provider URL (e.g., Infura, Alchemy, or local node)
const providerUrl = 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID';
const provider = new ethers.JsonRpcProvider(providerUrl);

// Replace with your smart contract address and ABI
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contractABI = [
  // Add the ABI of your contract here
  "function createAgreement(uint256 proposalId, uint256 tenantId, uint256 ownerId, string memory content, uint256 deposit, uint256 initRentalFee) public",
  "function updateAgreement(uint256 agreementId, uint8 action, uint8 newStatus) public",
  "function editDepositStatus(uint256 agreementId, uint8 newDepositStatus) public",
  "function getAgreement(uint256 agreementId) public view returns (tuple(uint256 agreementId, uint256 proposalId, uint256 tenantId, uint256 ownerId, string content, uint256 deposit, uint8 depositStatus, uint256 initRentalFee, uint8 initialFeeStatus, bool tenantSignature, bool ownerSignature, uint8 agreementStatus, uint256 createdTimestamp))"
];

const wallet = new ethers.Wallet('YOUR_WALLET_PRIVATE_KEY', provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

export const createAgreementOnBlockchain = async (proposalId: number, tenantId: number, ownerId: number, content: string, deposit: number, initRentalFee: number) => {
  try {
    const tx = await contract.createAgreement(proposalId, tenantId, ownerId, content, deposit, initRentalFee);
    await tx.wait();  // Wait for transaction to be mined
    return tx;
  } catch (error) {
    console.error('Error creating agreement on blockchain:', error);
    throw error;
  }
};

export const updateAgreementOnBlockchain = async (agreementId: number, action: number, newStatus?: number) => {
  try {
    const tx = await contract.updateAgreement(agreementId, action, newStatus || 0); // Default to 0 if no status is provided
    await tx.wait();  // Wait for transaction to be mined
    return tx;
  } catch (error) {
    console.error('Error updating agreement on blockchain:', error);
    throw error;
  }
};

export const getAgreementFromBlockchain = async (agreementId: number) => {
  try {
    const agreement = await contract.getAgreement(agreementId);
    return agreement;
  } catch (error) {
    console.error('Error fetching agreement from blockchain:', error);
    throw error;
  }
};
