const { TransferTransaction, Wallet, Client, TokenCreateTransaction, AccountBalanceQuery, TokenUnpauseTransaction, TokenPauseTransaction, TokenType, TokenSupplyType, TokenAssociateTransaction, PrivateKey } = require("@hashgraph/sdk");
require('dotenv').config()

const accountId1 = process.env.ACCOUNT_ID_1;
const privateKey1 = process.env.PRIVATE_KEY_1;
const publicKey1 = process.env.PUBLIC_KEY_1;

const accountId2 = process.env.ACCOUNT_ID_2;
const privateKey2 = process.env.PRIVATE_KEY_2;
const publicKey2 = process.env.PUBLIC_KEY_2;

const accountId3 = process.env.ACCOUNT_ID_3;
const privateKey3 = process.env.PRIVATE_KEY_3;
const publicKey3 = process.env.PUBLIC_KEY_3;

const accountId4 = process.env.ACCOUNT_ID_4;
const privateKey4 = process.env.PRIVATE_KEY_4;
const publicKey4 = process.env.PUBLIC_KEY_4;

async function createToken({ name, symbol, initialSupply, maxSupply }, treasuryAccount, supplyAccount) {
  const supplyUser = new Wallet(
    supplyAccount.id,
    supplyAccount.privateKey
  )

  const client = Client.forTestnet();
  client.setOperator(treasuryAccount.id, treasuryAccount.privateKey);

  let tokenCreateTx = await new TokenCreateTransaction()
    .setTokenName(name)
    .setTokenSymbol(symbol)
    .setTokenType(TokenType.FungibleCommon)
    .setDecimals(2)
    .setInitialSupply(initialSupply)
    .setTreasuryAccountId(treasuryAccount.id)
    .setSupplyType(TokenSupplyType.Finite)
    .setSupplyKey(supplyUser.publicKey)
    .setMaxSupply(maxSupply)
    .setPauseKey(supplyUser.publicKey)
    .freezeWith(client);

  let tokenCreateSign = await tokenCreateTx.sign(PrivateKey.fromString(treasuryAccount.privateKey));
  let tokenCreateSubmit = await tokenCreateSign.execute(client);
  let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);

  let tokenId = tokenCreateRx.tokenId;

  console.log(`- Created token with ID: ${tokenId} \n`);

  return tokenId;
}

async function associateTokenToAccount(tokenId, account, treasury) {
  const client = Client.forName('testnet');
  client.setOperator(treasury.id, treasury.privateKey);

  const transaction = await new TokenAssociateTransaction()
    .setAccountId(account.id)
    .setTokenIds([tokenId])
    .freezeWith(client)
    .sign(PrivateKey.fromString(account.privateKey));

  const transactionSubmit = await transaction.execute(client);

  const transactionReceipt = await transactionSubmit.getReceipt(client);

  console.log(`- Token association with account ${account.id}: ${transactionReceipt.status} \n`);

  return transactionReceipt;
}

async function sendTokens(tokenId, from, to, amount) {
  const client = Client.forName('testnet');
  client.setOperator(from.id, from.publicKey);

  const senderBalance = await new AccountBalanceQuery().setAccountId(from.id).execute(client);
  console.log(`- Sender balance: ${senderBalance.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);
  const receiverBalance = await new AccountBalanceQuery().setAccountId(to.id).execute(client);
  console.log(`- Receiver balance: ${receiverBalance.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);

  let tokenTransferTx;
  let tokenTransferSubmit;
  let tokenTransferRx;
  try {
    tokenTransferTx = await new TransferTransaction()
      .addTokenTransferWithDecimals(tokenId, from.id, -amount, 2)
      .addTokenTransferWithDecimals(tokenId, to.id, amount, 2)
      .setMaxTransactionFee(amount)
      .freezeWith(client)
      .sign(PrivateKey.fromString(from.privateKey));

    tokenTransferSubmit = await tokenTransferTx.execute(client);

    tokenTransferRx = await tokenTransferSubmit.getReceipt(client);
  } catch (error) {
    console.log('\n- Could not transfer tokens')
    return null
  }

  console.log(`\n- Stablecoin transfer from Treasury to ${to.id}: ${tokenTransferRx.status} \n`);

  const senderBalance2 = await new AccountBalanceQuery().setAccountId(from.id).execute(client);
  console.log(`- Sender balance: ${senderBalance2.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);
  const receiverBalance2 = await new AccountBalanceQuery().setAccountId(to.id).execute(client);
  console.log(`- Receiver balance: ${receiverBalance2.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);

  return tokenTransferRx
}

async function pauseToken(tokenId, supplyUser) {
  const client = Client.forName('testnet');
  client.setOperator(supplyUser.id, supplyUser.privateKey);

  const transaction = await new TokenPauseTransaction()
    .setTokenId(tokenId)
    .freezeWith(client);

  const signTx = await transaction.sign(PrivateKey.fromString(supplyUser.publicKey));
  const txResponse = await signTx.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const transactionStatus = receipt.status;

  console.log("The transaction consensus status " + transactionStatus.toString());

  return receipt;
}

async function unpauseToken(tokenId, supplyUser) {
  const client = Client.forName('testnet');
  client.setOperator(supplyUser.id, supplyUser.privateKey);

  const transaction = new TokenUnpauseTransaction()
    .setTokenId(tokenId)
    .freezeWith(client);

  const signTx = await transaction.sign(PrivateKey.fromString(supplyUser.publicKey));

  const txResponse = await signTx.execute(client);

  const receipt = await txResponse.getReceipt(client);

  const transactionStatus = receipt.status;

  console.log("The transaction consensus status " + transactionStatus.toString());

  return receipt;
}

async function main() {
  const treasuryAccount = { id: accountId1, privateKey: privateKey1, publicKey: publicKey1 };
  const supplyAccount = { id: accountId2, privateKey: privateKey2, publicKey: publicKey2 };

  const tokenId = await createToken({
    name: "Barrage Original Token",
    symbol: "BOT",
    initialSupply: 35050,
    maxSupply: 50000
  }, treasuryAccount, supplyAccount);

  const account3 = { id: accountId3, privateKey: privateKey3, publicKey: publicKey3 };
  const account4 = { id: accountId4, privateKey: privateKey4, publicKey: publicKey4 };

  await associateTokenToAccount(tokenId, account3, treasuryAccount)
  await associateTokenToAccount(tokenId, account4, treasuryAccount)

  await sendTokens(tokenId, treasuryAccount, account3, 2525)
  await sendTokens(tokenId, treasuryAccount, account4, 2525)

  await pauseToken(tokenId, supplyAccount)
  await sendTokens(tokenId, treasuryAccount, account4, 135)

  await unpauseToken(tokenId, supplyAccount)
  await sendTokens(tokenId, treasuryAccount, account4, 135)
}

main();


/**
 * Created token with ID: 0.0.49354638 
- Token association with account 0.0.49352673: SUCCESS 

- Token association with account 0.0.49352674: SUCCESS 

- Sender balance: 35050 units of token ID 0.0.49354638
- Receiver balance: 0 units of token ID 0.0.49354638

- Stablecoin transfer from Treasury to 0.0.49352673: SUCCESS 

- Sender balance: 32525 units of token ID 0.0.49354638
- Receiver balance: 2525 units of token ID 0.0.49354638
- Sender balance: 32525 units of token ID 0.0.49354638
- Receiver balance: 0 units of token ID 0.0.49354638

- Stablecoin transfer from Treasury to 0.0.49352674: SUCCESS 

- Sender balance: 30000 units of token ID 0.0.49354638
- Receiver balance: 2525 units of token ID 0.0.49354638
The transaction consensus status SUCCESS
- Sender balance: 30000 units of token ID 0.0.49354638
- Receiver balance: 2525 units of token ID 0.0.49354638

- Could not transfer tokens
The transaction consensus status SUCCESS
- Sender balance: 30000 units of token ID 0.0.49354638
- Receiver balance: 2525 units of token ID 0.0.49354638

- Stablecoin transfer from Treasury to 0.0.49352674: SUCCESS 

- Sender balance: 29865 units of token ID 0.0.49354638
- Receiver balance: 2660 units of token ID 0.0.49354638
 */