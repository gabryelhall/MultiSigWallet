const { expectRevert } = require("@openzeppelin/test-helpers");
const MultiSigWallet = artifacts.require('MultiSigWallet');

contract('MultiSigWallet', (accounts) => {
  let multiSigWallet = null;
  before(async () => {
    multiSigWallet = await MultiSigWallet.deployed();
  });

  it("SHOULD CREATE TRANSFER", async () => {
      await multiSigWallet.createTransfer(100, accounts[5], {from:accounts[0]});
      const transfer = await multiSigWallet.transfers(0);
      assert(transfer.id.toNumber() === 0);
      assert(transfer.amount.toNumber() === 100);
  });

  it("SHOULD NOT CREATE TRANSFER", async () => {
      await expectRevert(multiSigWallet.createTransfer(100, accounts[5], {from:accounts[6]}), "only approver allowed");  
  });

  it("SHOULD NOT SEND TRANSFER IF QUORUM NOT REACHED", async () => {
      const initialBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
      await multiSigWallet.createTransfer(100, accounts[6], {from:accounts[0]});
      await multiSigWallet.sendTransfer(1, {from: accounts[1]});
      const finalBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
      assert(finalBalance.sub(initialBalance).isZero());
  });

  it("SHOULD SEND TRANSFER IF QUORUM IS REACHED", async () => {
      const initialBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
      await multiSigWallet.createTransfer(100, accounts[6], {from:accounts[0]});
      await multiSigWallet.sendTransfer(2, {from: accounts[1]});
      await multiSigWallet.sendTransfer(2, {from: accounts[2]});
      const finalBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
      assert(finalBalance.sub(initialBalance).toNumber() === 100);
  });
});