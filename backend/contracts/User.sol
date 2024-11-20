// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract User {
    enum Role {tenant, owner}

    // Caution: solidity don't have float type. so store as uint256, when use, divide to show two decimal place; when store, expect the input has two decimal place so can multiply by 100 to store in unint256.
    // solidity don't support datetime. use timestamp.
    // no need modified_date. The data is immutable, only can create new one.

    struct UserInfo {
        uint256 userId;
        string username;
        string password;
        string email;
        string phoneNumber;
        Role role;
        uint256 walletAmount;
        uint createdTimestamp;        
    }

    // Store the hash of the agreement data
    // key is user id
    mapping(uint256 => bytes32) public agreements; 

    event UserCreated();

    // Function to create an agreement
    function createUser(
        uint256 userId,
        string memory username,
        string memory password,
        string memory email,
        string memory phoneNumber,
        Role userRole,
        uint256 walletAmount
    ) public {
        // Create the agreement struct
        UserInfo memory newUser = UserInfo({
            userId: userId,
            username: username,
            password: password,
            email: email,
            phoneNumber: phoneNumber,
            role: userRole,
            walletAmount: walletAmount,
            createdTimestamp: block.timestamp
        });

        // Hash the agreement struct (you can concatenate fields or use a more complex hash if needed)
        bytes32 userInfoHash = keccak256(abi.encodePacked(
            newUser.username,
            newUser.password,
            newUser.email,
            newUser.phoneNumber,
            newUser.role,
            newUser.walletAmount,
            newUser.createdTimestamp
        ));

        uint256 newUserId = newUser.userId; 
        agreements[newUserId] = userInfoHash; // Store the hash of the agreement data in the mapping

        // Emit event for agreement creation
        // emit UserCreated(agreementId, document1, document2, newAgreement.status);

        // Return agreement data (this data will be used to store off-chain in PostgreSQL)
        // return (
        //     agreementHash, // Return the hash of the agreement
        //     newAgreement.userId,
        //     newAgreement.document1,
        //     newAgreement.document2,
        //     newAgreement.tenantSigned,
        //     newAgreement.ownerSigned,
        //     newAgreement.status
        // );
    }
}
