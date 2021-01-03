const MultiSigWallet = artifacts.require("MultiSigWallet");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(MultiSigWallet, [accounts[0], accounts[1], accounts[2]], 2, {value:1000});
};
