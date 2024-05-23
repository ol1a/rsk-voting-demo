require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-web3");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    rootstock: {
      url: "https://public-node.testnet.rsk.co",
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};