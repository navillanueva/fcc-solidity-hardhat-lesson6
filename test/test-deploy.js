// doing good tests is crucial for our smart contract developing
// by testing our code we can ensure that it does exactly what we want it to do and
// look for posible exploits hackers may want to take advantage of
// hardhat testing runs with mocha

// describe("SimpleStorage", () => {})     ---> is the same thing

const { ethers, run, network } = require("hardhat")

// package for testing
// always try to use assert instead of expect
const { expect, assert } = require("chai")

describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage // we have to declare it before so we can later access them from the "it()" functions
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should start with a favorite number of 0", async function () {
        // inside the "it" we describe what we want to test
        // there can be several its
        // there can be a describe inside of a describe to further detail what we want to test
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"
        assert.equal(currentValue.toString(), expectedValue) // we have to cast bigNumber (currentValue) to a String
        // expect(currentValue.toString().to.equal(expectedValue))      ---> does the same thing as the line above
    })

    // to run/select a specific test we can run " yarn hardhat test --grep "store"
    // this command will run the test below
    // in between the "" we can insert any waord that is included in the string description of the test

    // another way of running a specific test is by writing:
    //      it.only("blabla", async function() {})

    it("Should update when we call store", async function () {
        const expectedValue = "7"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1) // to ensure the txn is registered in the blockchain

        const currentValue = await simpleStorage.retrieve()
        assert.equal(currentValue.toString(), expectedValue)
    })
})
