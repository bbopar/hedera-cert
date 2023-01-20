const {
  Client,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicMessageQuery
} = require("@hashgraph/sdk");
require('dotenv').config();

const accountId1 = process.env.ACC_ID_ID;
const privateKey1 = PrivateKey.fromString(process.env.ACC_1_PRIVATE_KEY);

async function main() {
  const client = Client.forName(process.env.HEDERA_NETWORK);
  client.setOperator(accountId1, privateKey1);

  // CREATE TOPIC
  let txResponse = await new TopicCreateTransaction().execute(client);
  let receipt = await txResponse.getReceipt(client);

  let topicId = receipt.topicId;

  console.log(`The newly created topic ID is: ${topicId}`);

  // Timeout to get the network time to process this request before continuing with another action
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // SEND MESSAGE
  const sendResponse = await new TopicMessageSubmitTransaction({
    topicId,
    message: new Date().toTimeString()
  })
    .execute(client);

  const getReceipt = await sendResponse.getReceipt(client);

  console.log('Message receipt:');
  console.log(JSON.stringify(getReceipt));

  console.log(`The message transaction status is: ${getReceipt.status}`);

  console.log(`Link to topic: https://hashscan.io/testnet/topic/${topicId}`);

  // SUBSCRIBE/READ TOPIC
  new TopicMessageQuery()
    .setTopicId(topicId)
    .setStartTime(0)
    .subscribe(
      client,
      (message) => console.log(Buffer.from(message.contents, "utf8").toString())
    );

  // process.exit();
}

main();


/**
 * The newly created topic ID is: 0.0.49354665
    Message receipt:
  {"status":{"_code":22},"accountId":null,"fileId":null,"contractId":null,"topicId":null,"tokenId":null,"scheduleId":null,"exchangeRate":{"hbars":30000,"cents":184321,"expirationTime":"2023-01-20T15:00:00.000Z","exchangeRateInCents":6.144033333333334},"topicSequenceNumber":{"low":1,"high":0,"unsigned":false},"topicRunningHash":{"0":92,"1":218,"2":122,"3":67,"4":127,"5":218,"6":117,"7":114,"8":131,"9":220,"10":235,"11":19,"12":116,"13":61,"14":92,"15":181,"16":125,"17":115,"18":182,"19":249,"20":80,"21":81,"22":123,"23":38,"24":42,"25":185,"26":111,"27":129,"28":228,"29":121,"30":120,"31":67,"32":8,"33":201,"34":123,"35":100,"36":227,"37":46,"38":198,"39":194,"40":221,"41":38,"42":142,"43":102,"44":0,"45":216,"46":238,"47":104},"totalSupply":{"low":0,"high":0,"unsigned":false},"scheduledTransactionId":null,"serials":[],"duplicates":[],"children":[]}
  The message transaction status is: SUCCESS
  Link to topic: https://hashscan.io/testnet/topic/0.0.49354665
  15:00:39 GMT+0100 (Central European Standard Time)
 */