// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./VibeToken.sol";

contract RewardManager {
    VibeToken public vibeToken;
    address public owner;

    event TokensMinted(address indexed user, uint256 amount);

    constructor(address _vibeTokenAddress) {
        vibeToken = VibeToken(_vibeTokenAddress);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function rewardUser(address user, uint256 sentimentScore) external onlyOwner {
        require(sentimentScore >= 0 && sentimentScore <= 1, "Invalid score");

        uint256 rewardAmount = sentimentScore * 10 * 10 ** 18; // Example: sentiment 0.8 → 8 VBT
        vibeToken.mint(user, rewardAmount);
        
        emit TokensMinted(user, rewardAmount);
    }
}
