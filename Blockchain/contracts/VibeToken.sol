// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VibeToken is ERC20, Ownable {
    uint256 public immutable maxSupply = 10_000_000 * 10**18; // Maximum supply of 10 million VBT

    constructor() ERC20("VibeShare", "VIBE") Ownable(msg.sender) {
        uint256 initialSupply = 1_000_000 * 10**18; // Initial supply of 1 million VBT
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Mint new tokens, only callable by the owner.
     * Ensures that total supply does not exceed max supply.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= maxSupply, "Max supply exceeded");
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens from the caller's balance.
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
