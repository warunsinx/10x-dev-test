// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ITenXBank.sol";
import "./abstract/FeeCollector.sol";

contract TenXBank is ITenXBank, FeeCollector, Ownable {

    IERC20 public constant bankToken;

    constructor(IERC20 _bankToken) {
        bankToken = _bankToken;
    }

    struct Account {
        bool exists;
        address owner;
        uint256 balance;
    }

    mapping(string => Account) public accounts;
    mapping(address => Account[]) public allAccounts;

    function _checkAccount(string memory name) internal view returns (bool) {
        return accounts[name].exists;
    }

    function createAccount(string memory name) external override {
        require(!_checkAccount(name), "Account name has already been taken");
        accounts[name].exists = true;
        accounts[name].owner = msg.sender;
        accounts[name].balance = 0;
        allAccounts[msg.sender].push(name);
        emit AccountCreated(name, msg.sender);
    }

    function deposit(string memory name, uint256 amount) external override {
        require(_checkAccount(name), "Account not found");
        require(msg.sender == accounts[name].owner, "Account owner does not match");
        bankToken.transferFrom(msg.sender, address(this), amount);
        accounts[name].balance += amount;
        emit TokenDeposited(name, amount);
    }

    function withdraw(string memory name, uint256 amount) external override {
        require(_checkAccount(name), "Account not found");
        require(msg.sender == accounts[name].owner, "Account owner does not match");
        require(accounts[name].balance > amount, "Insufficient account balance");
        accounts[name].balance -= amount;
        bankToken.transfer(msg.sender, amount);
        emit TokenWithdrawn(name, amount);
    }

    function _transfer(
        string memory from,
        string memory to,
        uint256 amount
    ) internal override {
        require(_checkAccount(from), "Sender account not found");
        require(_checkAccount(to), "Receiver account not found");
        require(msg.sender == accounts[from].owner, "Account owner does not match");
        require(accounts[from].balance > amount, "Insufficient account balance");
        
        uint256 amountWithFee = amount;
        if(msg.sender != accounts[to].owner) {
            (remaining) = calculateFee(amount);
            amountWithFee = remaining;
        }

        accounts[from].balance -= amountWithFee;
        accounts[to].balance += amountWithFee;
        emit TokenTransferred(from, to, amount);
    }

    function transfer(
        string memory from,
        string memory to,
        uint256 amount
    ) external override {
        _transfer(from, to, amount);
    }

    function transferBatch(
        string memory from,
        string[] memory to,
        uint256[] memory amounts
    ) external override {
        require(to.length == amounts.length, "Receivers and amounts missmatch");
        for (uint256 i = 0; i < to.length; i++) {
            _transfer(from, to[i], amounts[i]);
        }
    }

    function setFee(uint256 newFee) external onlyOwner {
        _setFee(newFee);
    }

    function collectFee(uint256 amount, address beneficiary) external onlyOwner {
        _collectFee(bankToken, amount, beneficiary)
    }    
}