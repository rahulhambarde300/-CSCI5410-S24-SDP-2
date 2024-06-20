
import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new DynamoDBClient({ region: "us-east-1" });
const sns = new SNSClient({ region: "us-east-1" });

export const handler = async(event) => {
    const {userId, roomId, startDate, endDate} = JSON.parse(event.body);

    if(!userId || !roomId || !startDate || !endDate){
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Please pass all the fields"})
        };
    }

    const start = new Date(startDate).toISOString();
    const end = new Date(endDate).toISOString();

    const queryParams = {
        TableName: 'Bookings',
        IndexName: 'RoomIdIndex',
        KeyConditionExpression: 'roomId = :roomId AND startDate < :end',
        FilterExpression: 'endDate > :start',
        ExpressionAttributeValues: {
          ':roomId': { S: roomId },
          ':start': { S: start },
          ':end': { S: end }
        }
    };

    try{
        const currentBookings = await dynamoDb.send(new QueryCommand(queryParams));
        if (currentBookings.Items.length > 0) {
            //TODO: Send msg to SNS that booking failed
            // const message = {
            //     bookingId: bookingId,
            //     userId: userId,
            //     roomId: roomId,
            //     startDate: start,
            //     endDate: end,
            //     status: "Already Booked"
            // }
            return {
              statusCode: 409,
              body: JSON.stringify({ message: 'Room is already booked for the given dates' }),
            };
        }
      
        const bookingId = uuidv4();
        const bookingParams = {
            TableName: 'Bookings',
            Item: {
                bookingId: { S: bookingId },
                userId: { S: userId },
                roomId: { S: roomId },
                startDate: { S: start },
                endDate: { S: end },
                status: { S: 'Booked' }
            }
        };

        await dynamoDb.send(new PutItemCommand(bookingParams));
        
        const message = {
            bookingId: bookingId,
            userId: userId,
            roomId: roomId,
            startDate: start,
            endDate: end,
            status: "Booked"
        };


        await sns.send(new PublishCommand({
            Message: JSON.stringify(message),
            TopicArn: 'arn:aws:sns:us-east-1:960148008907:Booking',
          }));
      

        return {
            statusCode: 201,
            body: JSON.stringify({message: "Room booked successfully", details: message})
        };
    }
    catch(error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Error while booking the room"})
        };
    }
    

};