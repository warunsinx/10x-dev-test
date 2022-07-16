// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ITenXBank {
    struct Account {
        bool exists;
        address owner;
        uint256 balance;
    }

    event AccountCreated(string indexed name, address indexed owner);
    event TokenDeposited(string indexed name, uint256 indexed amount);
    event TokenWithdrawn(string indexed name, uint256 indexed amount);
    event TokenTransferred(
        string indexed from,
        string indexed to,
        uint256 indexed amount
    );

    function createAccount(string memory name) external;

    function deposit(string memory name, uint256 amount) external;

    function withdraw(string memory name, uint256 amount) external;

    function transfer(
        string memory from,
        string memory to,
        uint256 amount
    ) external;

    function transferBatch(
        string memory from,
        string[] memory to,
        uint256[] memory amounts
    ) external;

    function getOwnerAccounts(address owner)
        external
        view
        returns (string[] memory);
}
