const { Client, PrivateKey, PublicKey, AccountCreateTransaction, AccountBalanceQuery, Hbar } = require("@hashgraph/sdk");
require("dotenv").config();

// Grab the OPERATOR_ID and OPERATOR_KEY from the .env file
const myAccountId = process.env.MY_ACCOUNTID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;

// Build Hedera testnet and mirror node client
const client = Client.forTestnet();

// Set the operator account ID and operator private key
client.setOperator(myAccountId, myPrivateKey);

async function main() {
  const newAccountPrivateKey1 = PrivateKey.generateED25519();
  const newAccountPrivateKey2 = PrivateKey.generateED25519();
  const newAccountPrivateKey3 = PrivateKey.generateED25519();
  const newAccountPrivateKey4 = PrivateKey.generateED25519();
  const newAccountPrivateKey5 = PrivateKey.generateED25519();

  // Create a new account with 1,000 tinybar starting balance
  const account1 = await new AccountCreateTransaction()
    .setKey(newAccountPrivateKey1.publicKey)
    .setInitialBalance(1000)
    .execute(client);
  // Create a new account with 1,000 tinybar starting balance
  const account2 = await new AccountCreateTransaction()
    .setKey(newAccountPrivateKey2.publicKey)
    .setInitialBalance(1000)
    .execute(client);
  // Create a new account with 1,000 tinybar starting balance
  const account3 = await new AccountCreateTransaction()
    .setKey(newAccountPrivateKey3.publicKey)
    .setInitialBalance(1000)
    .execute(client);
  // Create a new account with 1,000 tinybar starting balance
  const account4 = await new AccountCreateTransaction()
    .setKey(newAccountPrivateKey4.publicKey)
    .setInitialBalance(1000)
    .execute(client);
  // Create a new account with 1,000 tinybar starting balance
  const account5 = await new AccountCreateTransaction()
    .setKey(newAccountPrivateKey5.publicKey)
    .setInitialBalance(1000)
    .execute(client);

  // Get the new account ID
  const getReceipt1 = await account1.getReceipt(client);
  const getReceipt2 = await account2.getReceipt(client);
  const getReceipt3 = await account3.getReceipt(client);
  const getReceipt4 = await account4.getReceipt(client);
  const getReceipt5 = await account5.getReceipt(client);
  const newAccountId1 = getReceipt1.accountId;
  const newAccountId2 = getReceipt2.accountId;
  const newAccountId3 = getReceipt3.accountId;
  const newAccountId4 = getReceipt4.accountId;
  const newAccountId5 = getReceipt5.accountId;

  // Log the account ID
  console.log("The new account1 ID is: " +newAccountId1);
  console.log("The new account2 ID is: " +newAccountId2);
  console.log("The new account3 ID is: " +newAccountId3);
  console.log("The new account4 ID is: " +newAccountId4);
  console.log("The new account5 ID is: " +newAccountId5);

  //Verify the account balance
  const accountBalance1 = await new AccountBalanceQuery()
    .setAccountId(newAccountId1)
    .execute(client);
  const accountBalance2 = await new AccountBalanceQuery()
    .setAccountId(newAccountId2)
    .execute(client);
  const accountBalance3 = await new AccountBalanceQuery()
    .setAccountId(newAccountId3)
    .execute(client);
  const accountBalance4 = await new AccountBalanceQuery()
    .setAccountId(newAccountId4)
    .execute(client);
  const accountBalance5 = await new AccountBalanceQuery()
    .setAccountId(newAccountId5)
    .execute(client);

  console.log('account1 PRIVATE_KEY:', newAccountPrivateKey1.toStringRaw())
  console.log('account1 PUBLIC_KEY:', newAccountPrivateKey1.publicKey.toStringRaw())
  console.log("account1 The new account balance is: " +accountBalance1.hbars.toTinybars() +" tinybar.");
  console.log('account2 PRIVATE_KEY:', newAccountPrivateKey2.toStringRaw())
  console.log('account2 PUBLIC_KEY:', newAccountPrivateKey2.publicKey.toStringRaw())
  console.log("account2 The new account balance is: " +accountBalance2.hbars.toTinybars() +" tinybar.");
  console.log('account3 PRIVATE_KEY:', newAccountPrivateKey3.toStringRaw())
  console.log('account3 PUBLIC_KEY:', newAccountPrivateKey3.publicKey.toStringRaw())
  console.log("account3 The new account balance is: " +accountBalance3.hbars.toTinybars() +" tinybar.");
  console.log('account4 PRIVATE_KEY:', newAccountPrivateKey4.toStringRaw())
  console.log('account4 PUBLIC_KEY:', newAccountPrivateKey4.publicKey.toStringRaw())
  console.log("account4 The new account balance is: " +accountBalance4.hbars.toTinybars() +" tinybar.");
  console.log('account5 PRIVATE_KEY:', newAccountPrivateKey4.toStringRaw())
  console.log('account5 PUBLIC_KEY:', newAccountPrivateKey4.publicKey.toStringRaw())
  console.log("account5 The new account balance is: " +accountBalance5.hbars.toTinybars() +" tinybar.");
  
}

main();


/**
 *  The new account1 ID is: 0.0.49352671
    The new account2 ID is: 0.0.49352672
    The new account3 ID is: 0.0.49352673
    The new account4 ID is: 0.0.49352674
    The new account5 ID is: 0.0.49352676
    account1 PRIVATE_KEY: 2001887be8b7a8844fc2c471fd74fce4ce70965340c3e2b09a7ae1d61c994d95
    account1 PUBLIC_KEY: 9da1764beaf058e94119fb10f4b5e5adc47f0045a0c3b1f0d593b0626d056bcb
    account1 The new account balance is: 100000000000 tinybar.
    account2 PRIVATE_KEY: 042755f5c3eded9057967778687f6e43138b4ee47848b2cb8769122e265c3d83
    account2 PUBLIC_KEY: dd163e7a2a82708bb5dec1151dc9b94844169c6b5a4b9a4e2a36c79feab9a08a
    account2 The new account balance is: 100000000000 tinybar.
    account3 PRIVATE_KEY: 083cb5e4251c269d129c4b92adee15a0592f00016910a5b7eb8ea05bba9c8106
    account3 PUBLIC_KEY: 07c28edecf34df5353a16d8f267de58d915c202d7e5a5b75a2c8c4c26203c530
    account3 The new account balance is: 100000000000 tinybar.
    account4 PRIVATE_KEY: 41790aa24c16eac0c5add5c4ce012e51ff7bfd01e52afd5d98fe026c5590ccde
    account4 PUBLIC_KEY: d3190e102d0796cae4b4279cbcb191fd5dac7b0e2ab7e372ac621bad63c815dd
    account4 The new account balance is: 100000000000 tinybar.
    account5 PRIVATE_KEY: 41790aa24c16eac0c5add5c4ce012e51ff7bfd01e52afd5d98fe026c5590ccde
    account5 PUBLIC_KEY: d3190e102d0796cae4b4279cbcb191fd5dac7b0e2ab7e372ac621bad63c815dd
    account5 The new account balance is: 100000000000 tinybar.
 */