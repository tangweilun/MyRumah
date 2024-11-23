// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RentalFee {
    enum FeeStatus {paid, pending}
    // Caution: solidity don"t have float type. 
    // Can store in string type. (If not hashed) When needed, return the result and turn to Number / Decimal type in typescript
    // solidity don"t support datetime. use timestamp.
    // 

    struct OrigRentalFeeRecord{
        uint256 feeId;        
        uint256 agreementId;  
        string amount;       
        string status;        
        string createdDate; 
    }

    struct HashedRentalFeeRecord {
        bytes32 feeHash;
        uint256 timestamp;     
    }

    // Store the hash of the agreement data
    // key is user id
    mapping(uint256 => HashedRentalFeeRecord) public rentalFeeRecords; 

    // Function to create an agreement
    function createFee (OrigRentalFeeRecord[] memory fees) public{

        for (uint256 i = 0; i < fees.length; i++) {
            // If no record exists for this feeId
            require(rentalFeeRecords[fees[i].feeId].timestamp == 0, "Fee is already exists.");

            bytes32 newFeeHash = keccak256(abi.encodePacked(
                fees[i].feeId,
                fees[i].agreementId,
                fees[i].amount,
                fees[i].status,
                fees[i].createdDate
            ));

            HashedRentalFeeRecord memory newFee = HashedRentalFeeRecord({
                feeHash: newFeeHash,
                timestamp: block.timestamp
            });

            rentalFeeRecords[fees[i].feeId] = newFee;

        }
    }

    function payFee(OrigRentalFeeRecord memory fee) public{
        // if no record
        require(rentalFeeRecords[fee.feeId].timestamp != 0, 'Rental fee does not exist.');

        bytes32 paidFeeHash = keccak256(abi.encodePacked(
            fee.feeId,
            fee.agreementId,
            fee.amount,
            fee.status,
            fee.createdDate
        ));

        HashedRentalFeeRecord memory paidFee = HashedRentalFeeRecord({
            feeHash: paidFeeHash,
            timestamp: block.timestamp
        });

        rentalFeeRecords[fee.feeId] = paidFee;
    }

    function getFee(uint256 feeId) public view returns (HashedRentalFeeRecord memory){
        return rentalFeeRecords[feeId];
    }
}
