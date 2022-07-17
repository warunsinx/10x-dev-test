// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DaiToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("DaiToken", "DAI") {
        _mint(msg.sender, initialSupply);
    }
}
