// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IFeeCollector {
    event FeeCollected(address indexed beneficiary, uint256 indexed amount);

    event FeeChanged(uint256 indexed oldFee, uint256 indexed newFee);

    function feeDecimals() external returns (uint256);

    function shifter() external returns (uint256);

    function fee() external returns (uint256);

    function collectFee(uint256 amount, address beneficiary) external;

    function setFee(uint256 newFee) external;
}
