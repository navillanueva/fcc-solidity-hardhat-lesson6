// Example of how to deploy in hardhat, very similar to manually deploying in JS and using ganache as a local blockchain
// Advantages:  working with hardhar we already have a local blockchain administered by hardhat
//              and we can add testnets if we want in the hardhat.config.js file

/**
 *  SCRIPTS vs TASKS
 *
 *      Scripts and tasks can basically do the same thing. However, it doesnt make that much sense to manually program something so it is available
 *      directly from the command line. In the course we will rely more on scripts, but outside of this course we can find a lot of tasks in other peoples code
 *
 *      Tasks --> better for plugins
 *      Scripts --> better for your local programming environment
 */

// imports

const { ethers, run, network } = require("hardhat") // better to import ethers from hardhat

// run import allows us to implement in this code all of the available tasks of hardhat we can execute from the terminal
// network import allows us to get the network configuration information --> to know when to run vberify function

// async main function

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()

    // whats the private key?
    // whats the rpc url?
    // Hardhat Network: local ethereum network node connected, works very similar to ganache
    //                  in hardhat.config.js we can add a network, if not, by default it runs
    //                  this hardhat network that comes automatically with private key and rpc url

    console.log(`Deployed contract to: ${simpleStorage.address}`)

    // checking what network we are deploying to and its information

    // console.log(network.config)

    /**
     *  4 == 4      true
     *  4 == "4"    true
     *  4 === 4     true
     *  4 === "4"   false
     */

    // conditional to figure out if we are deploying to the goerli testnet

    console.log(network.config.chainId) // returns undefined when we run the goerli network

    if (network.config.chainId == 4 && process.env.ETHERSCAN_API_KEY) {
        // example above shows "===" meaning and 420 is the chainId of the goerli network and we must have the api key (it has to return true)
        console.log("Waiting for block txes...")
        await simpleStorage.deployTransaction.wait(6) // we wait for some blocks to be mined before we verify to be sure the tx is registered in the blockchain
        await verify(simpleStorage.address, []) // we have to add await because verify function is an async function
        // since simpleStorage was already uploaded by the instructor, etherscan recognizes the byte code is the same and says that this contract has already been verified
    }

    // checking the current value of a variable in our smart contract
    const currentValue = await simpleStorage.retrieve()
    console.log(`Current value is: ${currentValue}`)

    // update the current value
    const transactionResponse = await simpleStorage.store(6)
    await transactionResponse.wait(1) // we wait one block for the tx to be registered in the blockchain
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value is: ${updatedValue}`)
}

// we are going to create a verify function but you can also verify manually through the terminal running
// the " verify " command we get by importing the "hardhat-etherscan" package
// how to run and what to include in this command can be found in the hardhat plugin documentation under @nomiclabs/hardhat-etherscan

// we only want to execute this function when we are deploying to a testnet
// if we deploy to the default hardhat network, there is no etherscan for this network since it is runned locally
// so in the function main() we have to specify when the code should run this verify function

async function verify(contractAddress, args) {
    console.log("Verifying contract...")

    try {
        // we add a try catch because sometimes etherscan verifys automatically, and if so, without try catch this function will revert
        await run("verify:verify", {
            // do not add space in between the ":" because hardhat will not recognize the command
            // verify:verify ==> the second verify is the specification of the subtask within the verify task that we select, there are more available (look at github repo hardhat-etherscan)
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

// run main

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
