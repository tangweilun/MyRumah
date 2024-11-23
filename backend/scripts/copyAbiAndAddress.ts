import fs from "fs";
import path from "path";

// Path to the deployed addresses file
const deployedAddressesPath = path.join(
  __dirname,
  "../ignition/deployments/chain-31337/deployed_addresses.json"
);

// Path to the ABI files and .env file
const abiFiles = [
  {
    source: path.join(
      __dirname,
      "../ignition/deployments/chain-31337/artifacts/DeploymentModule#RentalFee.json"
    ),
    destination: "../src/abi/rentalFee.json",
    envKey: "NEXT_PUBLIC_RENTAL_FEE_CONTRACT_ADDRESS",
    addressKey: "DeploymentModule#RentalFee",
  },
  // Add more contracts as needed
];

// Define the ABI copy logic and address updating
const copyABIsAndUpdateEnv = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Read the deployed_addresses.json file
      const deployedAddresses = JSON.parse(
        fs.readFileSync(deployedAddressesPath, "utf-8")
      );

      // Process each ABI file
      abiFiles.forEach((file) => {
        // Check if the source ABI file exists, then copy it
        if (fs.existsSync(file.source)) {
          // Overwrite the existing ABI file if it exists at the destination
          fs.copyFileSync(file.source, file.destination);
          console.log(
            `ABI file copied and overwritten at: ${file.destination}`
          );

          // Get the contract address from deployed_addresses.json
          const contractAddress = deployedAddresses[file.addressKey];

          // Check if the address exists in the deployed_addresses.json
          if (contractAddress) {
            updateEnvWithAddress(file.envKey, contractAddress);
          } else {
            console.error(
              `Contract address for ${file.addressKey} not found in deployed_addresses.json.`
            );
          }
        } else {
          console.log(`ABI file not found at: ${file.source}`);
        }
      });

      resolve(); // Resolve the promise when done
    } catch (error) {
      reject(error); // Reject the promise if an error occurs
    }
  });
};

// Function to update the .env file with the contract address
const updateEnvWithAddress = (key: string, address: string) => {
  const envPath = "../.env";

  // Read the current .env file
  let envFile = "";
  if (fs.existsSync(envPath)) {
    envFile = fs.readFileSync(envPath, "utf-8");
  }

  // Check if the key exists in the .env file
  const keyRegex = new RegExp(`^${key}=.*`, "m");

  if (keyRegex.test(envFile)) {
    envFile = envFile.replace(keyRegex, `${key}="${address}"`);
  } else {
    envFile += `\n${key}="${address}"`;
  }

  // Write the updated content back to the .env file
  fs.writeFileSync(envPath, envFile);
  console.log(`Contract address for ${key} updated in .env file`);
};

// Run the function
copyABIsAndUpdateEnv()
  .then(() => console.log("All ABI files copied and .env updated successfully"))
  .catch((error) => {
    console.error("Error copying ABI and updating .env:", error);
    process.exit(1);
  });
