// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgreementContract {
    struct Agreement {
        uint256 agreementId;
        uint256 proposalId;
        string content;
        uint256 deposit;
        string depositStatus;
        uint256 rentalFee;
        string agreementStatus;
        bool tenantSignature;
        bool ownerSignature;
        bytes32 agreementHash; // Store the hash of the agreement
    }

    mapping(uint256 => Agreement) public agreements;
    uint256 public agreementCount;

    // Event to log the creation of an agreement
    event AgreementCreated(uint256 agreementId, bytes32 agreementHash);

    // Function to create a new agreement
    function createAgreement(
        uint256 proposalId,
        string memory content,
        uint256 deposit,
        uint256 rentalFee,
        string memory depositStatus,
        string memory agreementStatus
    ) public returns (uint256) {
        agreementCount++;
        
        // Generate the hash for the agreement details
        bytes32 agreementHash = keccak256(abi.encodePacked(
            proposalId,
            content,
            deposit,
            rentalFee,
            depositStatus,
            agreementStatus
        ));

        // Create the new agreement
        agreements[agreementCount] = Agreement({
            agreementId: agreementCount,
            proposalId: proposalId,
            content: content,
            deposit: deposit,
            depositStatus: depositStatus,
            rentalFee: rentalFee,
            agreementStatus: agreementStatus,
            tenantSignature: false,
            ownerSignature: false,
            agreementHash: agreementHash
        });

        emit AgreementCreated(agreementCount, agreementHash);

        return agreementCount;
    }

    // Function to update an agreement (e.g., for signing or updating deposit status)
    function updateAgreement(
        uint256 agreementId,
        string memory newDepositStatus,
        string memory newAgreementStatus,
        bool newTenantSignature,  // Add parameter for tenant's signature
        bool newOwnerSignature    // Add parameter for owner's signature
    ) public {
        Agreement storage agreement = agreements[agreementId];

        // Update the agreement details
        agreement.depositStatus = newDepositStatus;
        agreement.agreementStatus = newAgreementStatus;
        agreement.tenantSignature = newTenantSignature;  // Update tenant's signature
        agreement.ownerSignature = newOwnerSignature;    // Update owner's signature

        // Re-hash the updated agreement
        bytes32 newAgreementHash = keccak256(abi.encodePacked(
            agreement.proposalId,
            agreement.content,
            agreement.deposit,
            agreement.rentalFee,
            newDepositStatus,
            newAgreementStatus,
            newTenantSignature,  // Include signature in the hash
            newOwnerSignature     // Include signature in the hash
        ));

        agreement.agreementHash = newAgreementHash;
    }

    // Function to fetch full details of a specific agreement
    function getAgreement(uint256 agreementId) public view returns (
        uint256 agreementId_,
        uint256 proposalId,
        string memory content,
        uint256 deposit,
        string memory depositStatus,
        uint256 rentalFee,
        string memory agreementStatus,
        bool tenantSignature,
        bool ownerSignature,
        bytes32 agreementHash
    ) {
        // Fetch the agreement from the mapping
        Agreement storage agreement = agreements[agreementId];

        // Return all relevant details of the agreement
        return (
            agreement.agreementId,
            agreement.proposalId,
            agreement.content,
            agreement.deposit,
            agreement.depositStatus,
            agreement.rentalFee,
            agreement.agreementStatus,
            agreement.tenantSignature,
            agreement.ownerSignature,
            agreement.agreementHash
        );
    }
}
