import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeploymentModule = buildModule("DeploymentModule", (m) => {
  const RentalFee = m.contract("RentalFee");

  return { RentalFee };
});

export default DeploymentModule;
