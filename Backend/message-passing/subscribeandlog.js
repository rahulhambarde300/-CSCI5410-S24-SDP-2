const { Firestore } = require('@google-cloud/firestore');
const axios = require('axios');

const firestore = new Firestore({
  projectId: 'csci5410-427115', // Replace with your actual project ID
  databaseId: 'csci5410'
});

exports.subscribeAndLog = async (message, context) => {
  const data = JSON.parse(Buffer.from(message.data, 'base64').toString());

  // Validate message content
  if (!data.customer_id || !data.concern || !data.booking_reference || !data.ticket_id) {
    console.error('Invalid message format. Must include customer_id, concern, and booking_reference and ticket_id');
    return;
  }

  try {
    // Log to Firestore
    const docRef = firestore.collection('customerMessages').doc();
    await docRef.set(data);

    // Make a GET request to the AWS API to get users with the role 'property agent'
    const response = await axios.get('AWS_API_URL_HERE');

    // Extract the list of agents from the response
    const agents = response.data.filter(user => user.role === 'property agent');

    if (agents.length === 0) {
      console.error('No property agents found.');
      return;
    }

    // Select a random agent
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    const receiverId = randomAgent.userId;

    // // Add the receiverId to the Firestore document
    await docRef.update({ receiverId });

    // Simulate forwarding to property agent
    console.log(`Forwarding message to agent ${JSON.stringify(data)}`);
  } catch (err) {
    console.error('Error:', err);
  }
};