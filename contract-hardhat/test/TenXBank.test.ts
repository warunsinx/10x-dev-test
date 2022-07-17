import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { DaiToken } from "../typechain-types/contracts/DaiToken";
import { TenXBank } from "../typechain-types/contracts/TenXBank";
import { deployTestDaiToken, deployTestTenXBank } from "./shared/deployer";
import { parseEther, formatEther } from "ethers/lib/utils";
import { expect } from "chai";

describe("TenXBank", () => {
  let rootAdmin: SignerWithAddress;
  let customer1: SignerWithAddress;
  let customer2: SignerWithAddress;
  let customer3: SignerWithAddress;
  let feeCollector: SignerWithAddress;
  let daiToken: DaiToken;
  let tenXBank: TenXBank;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    rootAdmin = signers[0];
    customer1 = signers[1];
    customer2 = signers[2];
    customer3 = signers[3];
    feeCollector = signers[4];
    daiToken = await deployTestDaiToken();
    tenXBank = await deployTestTenXBank(daiToken.address);

    daiToken.connect(rootAdmin).transfer(customer1.address, parseEther("100"));
    daiToken.connect(rootAdmin).transfer(customer2.address, parseEther("100"));
    daiToken.connect(rootAdmin).transfer(customer3.address, parseEther("100"));
  });

  describe("Create Account", () => {
    it("Should be able to create an account", async () => {
      await tenXBank.connect(customer1).createAccount("A");
      const hasAccount = (await tenXBank.accounts("A")).exists;
      expect(hasAccount).to.eq(true);
    });

    it("Should be able to revert if account name already existed", async () => {
      await tenXBank.connect(customer1).createAccount("A");
      await expect(
        tenXBank.connect(customer1).createAccount("A")
      ).to.be.revertedWith("Account name has already been taken");
    });
  });

  describe("Deposit", () => {
    it("Should be able to deposit an ERC20 to an Account", async () => {
      await tenXBank.connect(customer1).createAccount("A");
      await daiToken
        .connect(customer1)
        .approve(tenXBank.address, ethers.constants.MaxUint256);
      await tenXBank.connect(customer1).deposit("A", parseEther("10"));
      const accountBalanceA = +formatEther(
        (await tenXBank.accounts("A")).balance
      );
      expect(accountBalanceA).to.eq(10);
    });
    it("Should be able to revert if owner account does not exist", async () => {
      await expect(
        tenXBank.connect(customer1).deposit("A", parseEther("10"))
      ).to.be.revertedWith("Account not found");
    });
    it("Should be able to revert if account owner does not match sender", async () => {
      await tenXBank.connect(customer1).createAccount("A");
      await tenXBank.connect(customer2).createAccount("B");
      await daiToken
        .connect(customer1)
        .approve(tenXBank.address, ethers.constants.MaxUint256);
      await expect(
        tenXBank.connect(customer1).deposit("B", parseEther("10"))
      ).to.be.revertedWith("Account owner does not match");
    });
  });

  describe("Withdraw", () => {
    it("Should be able to withdraw an ERC20 from an Account", async () => {
      await tenXBank.connect(customer1).createAccount("A");
      await daiToken
        .connect(customer1)
        .approve(tenXBank.address, ethers.constants.MaxUint256);
      await tenXBank.connect(customer1).deposit("A", parseEther("20"));
      await tenXBank.connect(customer1).withdraw("A", parseEther("10"));
      const customer1Balance = +formatEther(
        await daiToken.balanceOf(customer1.address)
      );
      expect(customer1Balance).to.eq(90);
    });
    it("Should be able to revert if owner account does not exist", async () => {
      await expect(
        tenXBank.connect(customer1).withdraw("A", parseEther("10"))
      ).to.be.revertedWith("Account not found");
    });
    it("Should be able to revert if account owner does not match sender", async () => {
      await tenXBank.connect(customer1).createAccount("A");
      await daiToken
        .connect(customer1)
        .approve(tenXBank.address, ethers.constants.MaxUint256);
      await tenXBank.connect(customer1).deposit("A", parseEther("10"));
      await expect(
        tenXBank.connect(customer2).withdraw("A", parseEther("10"))
      ).to.be.revertedWith("Account owner does not match");
    });
    it("Should be able to revert if account balance is insufficient", async () => {
      await tenXBank.connect(customer1).createAccount("A");
      await expect(
        tenXBank.connect(customer1).withdraw("A", parseEther("10"))
      ).to.be.revertedWith("Insufficient account balance");
    });
  });

  describe("Transfer", () => {
    it("Should be able to transfer an ERC20 from an Account to another Account", async () => {
      await tenXBank.connect(customer1).createAccount("A");
      await tenXBank.connect(customer1).createAccount("B");
      await daiToken
        .connect(customer1)
        .approve(tenXBank.address, ethers.constants.MaxUint256);
      await tenXBank.connect(customer1).deposit("A", parseEther("10"));
      await tenXBank.connect(customer1).transfer("A", "B", parseEther("5"));
      const accountBalanceB = +formatEther(
        (await tenXBank.accounts("B")).balance
      );
      expect(accountBalanceB).to.eq(5);
    });
    it("Should be able to revert if owner account does not exist", async () => {
      await tenXBank.connect(customer1).createAccount("B");
      await expect(
        tenXBank.connect(customer1).transfer("A", "B", parseEther("5"))
      ).to.be.revertedWith("Account not found");
    });
    it("Should be able to revert if receiver account does not exist", async () => {
      await tenXBank.connect(customer1).createAccount("A");
      await expect(
        tenXBank.connect(customer1).transfer("A", "B", parseEther("5"))
      ).to.be.revertedWith("Receiver account not found");
    });
    it("Should be able to revert if account owner does not match sender", async () => {
      await tenXBank.connect(customer1).createAccount("A");
      await expect(
        tenXBank.connect(customer2).transfer("A", "B", parseEther("5"))
      ).to.be.revertedWith("Account owner does not match");
    });
    it("Should be able to revert if account balance is insufficient", async () => {});
  });

  describe("Fee", () => {
    it("Should be able to bypass fee if recevier is an owner account", async () => {
      await tenXBank.connect(customer1).createAccount("A");
      await tenXBank.connect(customer1).createAccount("B");
      await daiToken
        .connect(customer1)
        .approve(tenXBank.address, ethers.constants.MaxUint256);
      await tenXBank.connect(customer1).deposit("A", parseEther("10"));
      await tenXBank.connect(customer1).transfer("A", "B", parseEther("5"));
      const accountBalanceB = +formatEther(
        (await tenXBank.accounts("B")).balance
      );
      expect(accountBalanceB).to.eq(5);
    });
    it("Should be able to deduct fee if recevier is not an owner account", async () => {
      await tenXBank.connect(customer1).createAccount("A");
      await tenXBank.connect(customer2).createAccount("B");
      await daiToken
        .connect(customer1)
        .approve(tenXBank.address, ethers.constants.MaxUint256);
      await tenXBank.connect(customer1).deposit("A", parseEther("20"));
      await tenXBank.connect(customer1).transfer("A", "B", parseEther("10"));
      const accountBalanceB = +formatEther(
        (await tenXBank.accounts("B")).balance
      );
      expect(accountBalanceB).to.eq(9.9);
    });
    it("Should be able to collect fee if sender is rootAdmin", async () => {
      await tenXBank.connect(customer1).createAccount("A");
      await tenXBank.connect(customer2).createAccount("B");
      await daiToken
        .connect(customer1)
        .approve(tenXBank.address, ethers.constants.MaxUint256);
      await tenXBank.connect(customer1).deposit("A", parseEther("20"));
      await tenXBank.connect(customer1).transfer("A", "B", parseEther("10"));
      await tenXBank
        .connect(rootAdmin)
        .collectFee(parseEther("0.1"), feeCollector.address);
      const feeCollectorBalance = +formatEther(
        await daiToken.balanceOf(feeCollector.address)
      );
      expect(feeCollectorBalance).to.eq(0.1);
    });
    it("Should be able to change fee", async () => {
      await tenXBank.connect(rootAdmin).setFee(parseEther("1000"));
      const newFee = +formatEther(await tenXBank.fee());
      expect(newFee).to.eq(1000);
    });
    it("Should be able to revert collect fee if sender is not rootAdmin", async () => {
      await expect(
        tenXBank
          .connect(customer1)
          .collectFee(parseEther("0.1"), customer1.address)
      ).to.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Batch Transfer", () => {
    it("Should be able to transfer to multiple account", async () => {
      await tenXBank.connect(customer1).createAccount("A");
      await tenXBank.connect(customer1).createAccount("B");
      await tenXBank.connect(customer1).createAccount("C");
      await daiToken
        .connect(customer1)
        .approve(tenXBank.address, ethers.constants.MaxUint256);
      await tenXBank.connect(customer1).deposit("A", parseEther("30"));
      await tenXBank.connect(customer1).transferBatch(
        "A",
        ["B", "C"],
        ["10", "10"].map((val) => parseEther(val))
      );
      const accountBalanceB = +formatEther(
        (await tenXBank.accounts("B")).balance
      );
      const accountBalanceC = +formatEther(
        (await tenXBank.accounts("C")).balance
      );
      expect(accountBalanceB).to.eq(10);
      expect(accountBalanceC).to.eq(10);
    });
    it("Should be able to revert if reciever accounts and amounts missmatch", async () => {
      await expect(
        tenXBank.connect(customer1).transferBatch(
          "A",
          ["B", "C", "D"],
          ["10", "10"].map((val) => parseEther(val))
        )
      ).to.revertedWith("Receivers and amounts missmatch");
    });
  });
});
