// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IFeeCollector {

  event FeeCollected(
    address indexed beneficiary,
    address indexed token,
    uint256 amount
  );

  event FeeChanged(uint256 oldFee, uint256 newFee);

  function feeDecimals() external returns (uint256);

  function shifter() external returns (uint256);

  function fee() external returns (uint256);

  function collectFee(
    uint256 amount,
    address beneficiary
  ) external;

  function setFee(uint256 newFee) external;
}
