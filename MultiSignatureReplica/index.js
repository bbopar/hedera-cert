const { TransferTransaction, Hbar, HbarUnit, Client, AccountAllowanceApproveTransaction, PrivateKey, AccountId, TransactionId, AccountBalanceQuery } = require("@hashgraph/sdk")
require('dotenv').config();

// Acount 1
const account1 = PrivateKey.fromString(process.env.ACC_1_PRIVATE_KEY)
const account1Id = process.env.ACC_1_ID;

// Acount 2
const account2 = PrivateKey.fromString(process.env.ACC_2_PRIVATE_KEY)
const account2Id = process.env.ACC_2_ID;

// Acount 3
const account3 = PrivateKey.fromString(process.env.ACC_3_PRIVATE_KEY)
const account3Id = process.env.ACC_3_ID;

const client = Client.forTestnet();
client.setOperator(account2Id, account2);
client.setDefaultMaxTransactionFee(new Hbar(10));

async function createAllowance() {
    const tx = await new AccountAllowanceApproveTransaction()
        .approveHbarAllowance(account1Id, account2Id, new Hbar(20))
        .freezeWith(client)
        .sign(account1);

    const allowanceSubmit = await tx.execute(client);
    return await allowanceSubmit.getReceipt(client);
}

async function spendAllowance() {
    const approvedSendTx = await new TransferTransaction()
        .addApprovedHbarTransfer(account1Id, new Hbar(-20))
        .addHbarTransfer(account3Id, new Hbar(20))
        .setTransactionId(TransactionId.generate(account2Id))
        .freezeWith(client)
        .sign(account2);

    const approvedSendSubmit = await approvedSendTx.execute(client);
    return await approvedSendSubmit.getReceipt(client);
}

async function printBalance(accountId) {
    let balanceCheckTx = await new AccountBalanceQuery().setAccountId(accountId).execute(client);
    console.log(`- Account ${accountId}: ${balanceCheckTx.hbars.toString()}`);
}

async function main() {
    // await createAllowance();
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // await printBalance(account1Id);
    // await printBalance(account2Id);
    // await printBalance(account3Id);

    await spendAllowance();
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await printBalance(account1Id);
    await printBalance(account2Id);
    await printBalance(account3Id);
    process.exit()
}

main().catch((error) => console.log(`Error: ${error}`))


/**
 * 
 * - Account 0.0.49352671: 873.10743974 ℏ
   - Account 0.0.49352672: 878.65527296 ℏ
   - Account 0.0.49352673: 1000 ℏ
   - Account 0.0.49352671: 853.10743974 ℏ
   - Account 0.0.49352672: 878.65362412 ℏ
   - Account 0.0.49352673: 1020 ℏ
   - Error: {"name":"StatusError","status":"SPENDER_DOES_NOT_HAVE_ALLOWANCE","transactionId":"0.0.49352672@1674218178.62317929","message":"receipt for transaction 0.0.49352672@1674218178.62317929 contained error status SPENDER_DOES_NOT_HAVE_ALLOWANCE"}
 */