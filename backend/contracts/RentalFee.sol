// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RentalFee {
    enum FeeStatus {paid, pending}
    // Caution: solidity don"t have float type. 
    // Can store in string type. (If not hashed) When needed, return the result and turn to Number / Decimal type in typescript
    // solidity don"t support datetime. use timestamp.
    // 

    struct RentalFeeRecord {
        bytes32 feeHash;
        uint256 timestamp;     
    }

    // Store the hash of the agreement data
    // key is user id
    mapping(uint256 => RentalFeeRecord) public rentalFeeRecords; 

    event UserCreated();

    // Function to create an agreement
    function createFee(
        uint256 feeId,
        uint256 agreementId,
        string memory amount,
        string memory status,
        string memory createdDate
    ) public {
        // if no record
        require(rentalFeeRecords[feeId].timestamp == 0, "Fee ID already exists");

        bytes32 newFeeHash = keccak256(abi.encodePacked(
            agreementId,
            amount,
            status,
            createdDate
        ));

        RentalFeeRecord memory newFee = RentalFeeRecord({
            feeHash: newFeeHash,
            timestamp: block.timestamp
        });

        rentalFeeRecords[feeId] = newFee;

    }

    function payFee(
        uint256 feeId,
        uint256 agreementId,
        string memory amount,
        string memory status,
        string memory createdDate
    ) public {
        // if no record
        require(rentalFeeRecords[feeId].timestamp == 0, 'Appartment not found');

        bytes32 paidFeeHash = keccak256(abi.encodePacked(
            agreementId,
            amount,
            status,
            createdDate
        ));

        RentalFeeRecord memory paidFee = RentalFeeRecord({
            feeHash: paidFeeHash,
            timestamp: block.timestamp
        });

        rentalFeeRecords[feeId] = paidFee;

    }
}
