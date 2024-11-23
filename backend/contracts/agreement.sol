// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgreementContract {
    // Enum definitions for agreement states
    enum DepositStatus {
        pending,
        submitted,
        pending_returned,
        returned
    }

    enum InitialFeeStatus {
        pending,
        submitted
    }

    enum AgreementStatus {
        pending,
        ongoing,
        completed,
        expired
    }

    struct Agreement {
        uint256 agreementId;
        uint256 proposalId;
        uint256 tenantId; // ID of the tenant
        uint256 ownerId; // ID of the owner
        string content; // Details of the agreement
        uint256 deposit; // Deposit amount in smallest unit (e.g., cents)
        DepositStatus depositStatus;
        uint256 initRentalFee; // Initial rental fee
        InitialFeeStatus initialFeeStatus;
        bool tenantSignature;
        bool ownerSignature;
        AgreementStatus agreementStatus;
        uint256 createdTimestamp;
    }

    // Mapping to store agreements by agreement ID
    mapping(uint256 => Agreement) public agreements;

    // Mapping to associate users with their agreements
    mapping(uint256 => uint256[]) private userAgreements; // Maps userId to an array of agreement IDs

    // Event for agreement creation
    event AgreementCreated(uint256 agreementId, uint256 proposalId, string content);

    // Event for agreement updates
    event AgreementUpdated(uint256 agreementId, string fieldUpdated);

    uint256 private nextAgreementId = 1;

    /**
     * @dev Create a new agreement
     * @param proposalId ID of the proposal
     * @param tenantId ID of the tenant
     * @param ownerId ID of the owner
     * @param content Agreement content details
     * @param deposit Deposit amount
     * @param initRentalFee Initial rental fee
     */
    function createAgreement(
        uint256 proposalId,
        uint256 tenantId,
        uint256 ownerId,
        string memory content,
        uint256 deposit,
        uint256 initRentalFee
    ) public {
        uint256 agreementId = nextAgreementId;
        agreements[agreementId] = Agreement({
            agreementId: agreementId,
            proposalId: proposalId,
            tenantId: tenantId,
            ownerId: ownerId,
            content: content,
            deposit: deposit,
            depositStatus: DepositStatus.pending,
            initRentalFee: initRentalFee,
            initialFeeStatus: InitialFeeStatus.pending,
            tenantSignature: false,
            ownerSignature: false,
            agreementStatus: AgreementStatus.pending,
            createdTimestamp: block.timestamp
        });

        // Link agreement to tenant and owner
        userAgreements[tenantId].push(agreementId);
        userAgreements[ownerId].push(agreementId);

        nextAgreementId++;

        emit AgreementCreated(agreementId, proposalId, content);
    }

    /**
     * @dev Retrieve agreements by userId
     * @param userId ID of the user
     * @return Array of agreement IDs associated with the user
     */
    function getAgreementsByUserId(uint256 userId) public view returns (Agreement[] memory) {
        uint256[] memory agreementIds = userAgreements[userId];
        Agreement[] memory userAgreementsArray = new Agreement[](agreementIds.length);

        for (uint256 i = 0; i < agreementIds.length; i++) {
            userAgreementsArray[i] = agreements[agreementIds[i]];
        }

        return userAgreementsArray;
    }

    /**
     * @dev Update an agreement status or sign
     * @param agreementId ID of the agreement
     * @param action Action to perform: 0 = Tenant Sign, 1 = Owner Sign, 2 = Update Agreement Status
     * @param newStatus Optional new agreement status
     */
    function updateAgreement(
        uint256 agreementId,
        uint8 action,
        uint8 newStatus
    ) public {
        Agreement storage agreement = agreements[agreementId];
        require(agreement.agreementId != 0, "Agreement does not exist.");

        if (action == 0) {
            agreement.tenantSignature = true;
            emit AgreementUpdated(agreementId, "Tenant Signed");
        } else if (action == 1) {
            agreement.ownerSignature = true;
            emit AgreementUpdated(agreementId, "Owner Signed");
        } else if (action == 2) {
            require(newStatus <= uint8(AgreementStatus.expired), "Invalid status.");
            agreement.agreementStatus = AgreementStatus(newStatus);
            emit AgreementUpdated(agreementId, "Agreement Status Updated");
        } else {
            revert("Invalid action.");
        }
    }

    /**
     * @dev Edit the deposit status
     * @param agreementId ID of the agreement
     * @param newDepositStatus New deposit status
     */
    function editDepositStatus(uint256 agreementId, uint8 newDepositStatus) public {
        Agreement storage agreement = agreements[agreementId];
        require(agreement.agreementId != 0, "Agreement does not exist.");
        require(newDepositStatus <= uint8(DepositStatus.returned), "Invalid deposit status.");

        agreement.depositStatus = DepositStatus(newDepositStatus);
        emit AgreementUpdated(agreementId, "Deposit Status Updated");
    }

    /**
     * @dev Retrieve agreement details
     * @param agreementId ID of the agreement
     * @return Agreement details
     */
    function getAgreement(uint256 agreementId) public view returns (Agreement memory) {
        require(agreements[agreementId].agreementId != 0, "Agreement does not exist.");
        return agreements[agreementId];
    }
}
