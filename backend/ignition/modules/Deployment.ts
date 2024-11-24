import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeploymentModule = buildModule("DeploymentModule", (m) => {
  const RentalFee = m.contract("RentalFee");
  const Agreement = m.contract("AgreementContract");
  return { RentalFee,Agreement };
});

export default DeploymentModule;
