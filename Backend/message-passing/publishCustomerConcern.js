const { PubSub } = require('@google-cloud/pubsub');
const functions = require('@google-cloud/functions-framework');

const pubsub = new PubSub();

functions.http('publishMessage', (req, res) => {
  const topicName = 'projects/csci5410-427115/topics/customer-concerns';

  // Get message from request body
  const message = req.body;
  
  // Validate message content
  if (!message.customer_id || !message.concern || !message.booking_reference || !message.ticket_id) {
    return res.status(400).send('Invalid message format. Must include customer_id, concern, and booking_reference.');
  }

  const messageData = Buffer.from(JSON.stringify(message));

  pubsub
    .topic(topicName)
    .publish(messageData)
    .then(messageId => {
      console.log(`Published message ID: ${messageId}`);
      res.status(200).send(`Published message ID: ${messageId}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
      res.status(500).send(`Error publishing message: ${err}`);
    });
});
