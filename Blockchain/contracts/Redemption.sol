// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./VibeToken.sol";

contract Redemption {
    VibeToken public vibeToken;
    address public admin;

    event TokensRedeemed(address indexed user, uint256 amount, string reward);

    constructor(address _vibeTokenAddress) {
        vibeToken = VibeToken(_vibeTokenAddress);
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    function redeemTokens(uint256 amount, string memory reward) external {
        require(vibeToken.balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        vibeToken.transferFrom(msg.sender, admin, amount); // Admin receives tokens
        emit TokensRedeemed(msg.sender, amount, reward);
    }
}
