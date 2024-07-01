import { SNSClient, PublishCommand, SubscribeCommand  } from "@aws-sdk/client-sns";

const sns = new SNSClient({ region: "us-east-1" });

const topicArn = 'arn:aws:sns:us-east-1:960148008907:Registration';
const loginTopicArn = 'arn:aws:sns:us-east-1:960148008907:Login';

export const handler = async(event) => {
    const {userId, userName, email} = JSON.parse(event.body);

    if(!userId || !userName || !email){
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify({message: "Please pass all the fields"})
        };
    }
    const filterPolicy = {
        "UserId": [userId]
      };

    const registrationSubscribeParams = {
        TopicArn: topicArn,
        Protocol: 'email',
        Endpoint: email,
        Attributes: {
          'FilterPolicy': JSON.stringify(filterPolicy)
        }
    };

    const loginSubscribeParams = {
        TopicArn: loginTopicArn,
        Protocol: 'email',
        Endpoint: email,
        Attributes: {
          'FilterPolicy': JSON.stringify(filterPolicy)
        }
    };

    const subject = "Welcome to DalVacationHome!";
    const message = `Hi ${userName},
    
    We're excited to have you join us at DalVacationHome!
    Your registration was successful, and you’re now part of our community. Here’s what you can do next:
    - Explore Our Home: Discover our available rooms.
    - Booking & Queries: Choose your rooms and book it.
    - Virtual Chatbot Support: Our chatbot can assist with queries regarding your booking.
    - Get Support: Our team is here to assist you whenever you need help.

    Need help getting started? Reach out to our support team.
    Thank you for joining us. We’re thrilled to have you!
    `

    try{
        const registrationSubscribeCommand = new SubscribeCommand(registrationSubscribeParams);
        const loginSubscribeCommand = new SubscribeCommand(loginSubscribeParams);
        //TODO: Uncomment this if you need to subscribe new emails for registration from code
        //await sns.send(subscribeCommand);
        await sns.send(loginSubscribeCommand);

        await sns.send(new PublishCommand({
            Message: message,
            Subject: subject,
            MessageAttributes: {
                UserId: {
                    DataType: 'String',
                    StringValue: userId,
                    },
                },
            TopicArn: topicArn
          }));
      

        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify({message: "Email sent successfully!", details: message})
        };
    }
    catch(error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify({message: "Failed to send email."})
        };
    }
    

};