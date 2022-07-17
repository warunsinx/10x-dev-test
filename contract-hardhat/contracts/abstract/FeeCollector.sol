// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IFeeCollector.sol";

abstract contract FeeCollector is IFeeCollector {
    uint256 public constant override feeDecimals = 4;
    uint256 public constant override shifter = 10**feeDecimals;
    uint256 public override fee = 100;

    function calculateFee(uint256 amount)
        internal
        view
        returns (uint256, uint256)
    {
        uint256 collectedFee = (amount * fee) / shifter;
        uint256 remaining = amount - collectedFee;
        return (remaining, collectedFee);
    }

    function _collectFee(
        IERC20 token,
        uint256 amount,
        address beneficiary
    ) internal {
        token.transfer(beneficiary, amount);
        emit FeeCollected(beneficiary, amount);
    }

    function _setFee(uint256 newFee) internal {
        uint256 oldFee = fee;
        fee = newFee;
        emit FeeChanged(oldFee, fee);
    }
}
