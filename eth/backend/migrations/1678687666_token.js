const token = artifacts.require('token')
module.exports = async function(_deployer, network, accounts) {
  const contract = _deployer.deploy(token, accounts[1], accounts[2], accounts[3], accounts[4], accounts[5]);
  const address = (await contract.chain).address;
  console.log(address)
};  