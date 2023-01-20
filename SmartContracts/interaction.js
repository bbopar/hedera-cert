const {
  Client,
  ContractFunctionParameters,
  PrivateKey,
  ContractExecuteTransaction,
  LocalProvider,
  Wallet,
} = require("@hashgraph/sdk");
require('dotenv').config();

const myAccountId = process.env.ACCOUNT_1_ID;
const myPrivateKey = PrivateKey.fromString(process.env.ACCOUNT_1_PRIVATE_KEY);
const contractId = process.env.CONTRACT_ID;
const fileId = process.env.FILE_ID;

// If we weren't able to grab it, we should throw a new error
if (myAccountId == null ||
  myPrivateKey == null) {
  throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(myAccountId, myPrivateKey);
//new ContractFunctionParameters().addUint16(6).addUint16(7)
async function interact() {
  const wallet = new Wallet(
    process.env.ACCOUNT_1_ID,
    process.env.ACCOUNT_1_PRIVATE_KEY,
    new LocalProvider()
);

  // Call a method on a contract exists on Hedera, but is allowed to mutate the contract state
  let trx = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(75000)
      .setFunction(
          "function1",
          new ContractFunctionParameters().addUint16(6).addUint16(7)
      )
      .freezeWithSigner(wallet);

  let transaction = await trx.signWithSigner(wallet);

  console.log('## transaction ##', transaction);

  const contractExecTransactionResponse = await transaction.executeWithSigner(
      wallet
  );

  const res = await contractExecTransactionResponse.getReceiptWithSigner(wallet);

  console.log('## res ##', res);
}

interact();
