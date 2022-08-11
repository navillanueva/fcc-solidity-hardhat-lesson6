// task to get the current block number of whatever blockchain we are working with

// import the task function
const { task } = require("hardhat/config")

task("block-number", "Prints the current block number").setAction(
    async (taskArgs, hre) => {
        // aka an unanimous function (has no name)
        // javascript arrow function, used to define a function without using "function" keyword
        // it is the same as writing " const blockTask = async function() => {}"
        // or " async function blockTask(){}"
        const blockNumber = await hre.ethers.provider.getBlockNumber()
        console.log(`Current block number: ${blockNumber}`)
    }
)

// for this to appear as an available task when we run "yarn hardhat" we have to import this file to the hardhat.config.js file
// we have to write this command for this to be posible

module.exports = {}
