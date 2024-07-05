import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const dynamoDb = new DynamoDBClient({ region: "us-east-1" });
const sns = new SNSClient({ region: "us-east-1" });

export const handler = async (event) => {
    for (const record of event.Records) {
        let body;

        try {
            body = JSON.parse(record.body);
        } catch (error) {
            console.error("Invalid JSON format:", record.body);
            continue;
        }

        const { userId, roomId, startDate, endDate } = body;

        if (!userId || !roomId || !startDate || !endDate) {
            console.error("Missing required fields:", body);
            continue;
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

        try {
            const currentBookings = await dynamoDb.send(new QueryCommand(queryParams));
            if (currentBookings.Items.length > 0) {
                console.error("Room already booked:", roomId);
                continue;
            }

            const bookingId = generateId();
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

            const subject = "Room booked successfully";
            const message = {
                bookingId: bookingId,
                userId: userId,
                roomId: roomId,
                startDate: start,
                endDate: end,
                status: "Booked"
            };

            await sns.send(new PublishCommand({
                Subject: subject,
                Message: JSON.stringify(message),
                TopicArn: 'arn:aws:sns:us-east-1:960148008907:Booking',
                MessageAttributes: {
                UserId: {
                    DataType: 'String',
                    StringValue: userId,
                    },
                },
            }));

            console.log("Room booked successfully:", message);
        } catch (error) {
            const subject = "Room booking failed";
            const message = `Sorry to inform you, but your booking for room ${roomId} could not be completed`;
            
            await sns.send(new PublishCommand({
                Subject: subject,
                Message: JSON.stringify(message),
                TopicArn: 'arn:aws:sns:us-east-1:960148008907:Booking',
                MessageAttributes: {
                    UserId: {
                        DataType: 'String',
                        StringValue: userId,
                        },
                    },
              }));
            console.error("Error processing booking:", error);
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Processing complete" }),
    };
};

function generateId() {
    const idLength = 6;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';

    for (let i = 0; i < idLength; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
