import { exec as execCallback } from "child_process";
import { promisify } from "util";

// Promisify the exec function
const execPromise = promisify(execCallback);

async function syncAll() {
  try {
    console.log("Starting RentalFee sync...");

    try {
      const rentalFeeResult = await execPromise(
        "npx ts-node backend/scripts/syncRentalFee.ts"
      );

      if (rentalFeeResult.stderr) {
        console.error(`RentalFee stderr: ${rentalFeeResult.stderr}`);
      } else {
        console.log(`${rentalFeeResult.stdout}`);
      }
    } catch (error) {
      console.error("Error during RentalFee sync:", error);
    }

    console.log("Starting Agreement sync...");

    try {
      const agreementResult = await execPromise(
        "npx ts-node backend/scripts/syncAgreement.ts"
      );

      if (agreementResult.stderr) {
        console.error(`Agreement stderr: ${agreementResult.stderr}`);
      } else {
        console.log(`${agreementResult.stdout}`);
      }
    } catch (error) {
      console.error("Error during Agreement sync:", error);
    }

    console.log("All syncs completed.");
  } catch (error) {
    console.error("Unexpected error during sync:", error);
  }
}

syncAll();
