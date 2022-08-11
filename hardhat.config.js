require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config() // we add this so we can add the information of our testnet network without unveiling secret information
require("@nomiclabs/hardhat-etherscan") // we add this so we can automatically verify a contract once it is deployed
require("./tasks/block-number") // import of the task we manually created within the tasks folder of this project
require("hardhat-gas-reporter") // to import gas reporting of our contract functions when we run the " hardhat test" command
require("solidity-coverage") // this package shows us what percentage of our code in our smart contract is not covered by tests

// for both of these imports we had to do " yarn add --dev **package_name** "

// any time we add an import to this file, it will most likely add to the list of AVAILABLE TASKS we can do when we run " yarn hardhat "
// however, for adding tasks, it is more profesional to creat a task folder where we implement the code for these tasks

const GOERLI_RPC_URL =
    process.env.GOERLI_RPC_URL || "https://eth-goerli/example"
const RINKEBY_RPC_URL =
    process.env.RINKEBY_RPC_URL || "https://eth-rinkeby/example" // we include the "or" expression just in case it cant find the rinkeby_rpc_url
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key"

// to use a blockchain locally that doesnt shut down like the default hardhat network one we can
// run " yarn hardhat node " and then hit the "+" to open up a new terminal

module.exports = {
    defaultNetwork: "hardhat", // everytime we run a contract the network is reset so we can talk/access it after
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chaindId: 420,
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 4,
        },
        localhost: {
            // this is how we save the network when running " yarn hardhat node "
            url: "http://127.0.0.1:8545/",
            chainId: 31337, // we dont have to give it accounts because it already generates these accounts when we create it
        },
    },
    solidity: "0.8.8",
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        // to configure it so that it automatically executes everytime we run the test command
        enabled: true, // leave this value in false when we dont want to work with the gas
        outputFile: "gas-report.txt", // to better view the table it shows in the terminal when we run a test
        noColors: true, // so that the coloring doesnt affect the file
        currency: "USD", //to get the report in a unit we can understand
        coinmarketcap: COINMARKETCAP_API_KEY, // key of our coinmarketcap user account
        // this is going to make an API call to coinmarketcap
        // token: "MATIC", // we can see the cost in different chains by running this command
    },
}

// we can access a javascript console (if we dont want to write a deploy contract) to play around with the blockchain we are connected to
// to do this we must run the code  " yarn hardhat console --network localhost " (we can pick any network we want)

/** CODE EXAMPLE RUNNED ON THE JAVASCRIPT CONSOLE
 *
 *    const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")   ==> returns undefined
 *    const simpleStorage = await SimpleStorageFactory.deploy()                       ==> returns undefined
 *    await simpleStorage.retrieve()                                                  ==> returns BigNumber { value: "0" }
 *    await simpleStorage.store("45")                                                 ==> returns txn data
 *    await simpleStorage.retrieve()                                                  ==> returns BigNumber { value: "45" }
 *
 */
