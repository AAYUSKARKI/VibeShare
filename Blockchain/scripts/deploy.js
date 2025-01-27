const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy VibeToken
    const VibeToken = await hre.ethers.getContractFactory("VibeToken");
    const vibeToken = await VibeToken.deploy();
    await vibeToken.waitForDeployment();
    const vibeTokenAddress = await vibeToken.getAddress();  // ✅ Fix: Get contract address correctly
    console.log("VibeToken deployed to:", vibeTokenAddress);

    // Deploy RewardManager with VibeToken address
    const RewardManager = await hre.ethers.getContractFactory("RewardManager");
    const rewardManager = await RewardManager.deploy(vibeTokenAddress);
    await rewardManager.waitForDeployment();
    const rewardManagerAddress = await rewardManager.getAddress();  
    console.log("RewardManager deployed to:", rewardManagerAddress);

    // Deploy Redemption with VibeToken address
    const Redemption = await hre.ethers.getContractFactory("Redemption");
    const redemption = await Redemption.deploy(vibeTokenAddress);
    await redemption.waitForDeployment();
    const redemptionAddress = await redemption.getAddress();  
    console.log("Redemption deployed to:", redemptionAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


// Deploying contracts with the account: 0xc706FC0AA0654C2C6Ea41C9Ff480cF1aa4e123f4
// VibeToken deployed to: 0x9198E3cb2904cC94733AD12FcFBdaBa15c170061
// RewardManager deployed to: 0x8968d426878E64a2C7ee774cfAE43cD78837466C
// Redemption deployed to: 0xbdC19822C79e1c3fc5e1100DB37077f53F983afA