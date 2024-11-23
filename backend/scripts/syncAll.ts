import { exec as execCallback } from "child_process";
import { promisify } from "util";

// Promisify the exec function
const execPromise = promisify(execCallback);

async function syncAll() {
  try {
    console.log("Starting RentalFee sync...");

    const { stdout, stderr } = await execPromise(
      "npx ts-node backend/scripts/syncRentalFee.ts"
    );

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
    console.log("All syncs completed.");
  } catch (error) {
    console.error("Error during sync:", error);
  }
}

syncAll();
