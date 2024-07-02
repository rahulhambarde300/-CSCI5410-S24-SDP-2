import { DynamoDBClient, ScanCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
};
const tableName = "Rooms";

export const handler = async (event) => {
    const body = event.body ? JSON.parse(event.body) : {};
    const roomId = event.queryStringParameters ? event.queryStringParameters.roomId : null;
    
    switch (event.httpMethod) {
        case "GET":
            return await getAllRooms();
        case "POST":
            return await addRoom(body);
        case "PUT":
            return await editRoom(body);
        case "DELETE":
            return await deleteRoom(roomId);
        default:
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({ message: "Unsupported method" })
            };
    }
};

const getAllRooms = async () => {
    try {
        const command = new ScanCommand({ TableName: tableName });
        const data = await client.send(command);
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(data.Items)
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: error.message })
        };
    }
};

const addRoom = async (body) => {
    try {
        const { roomId, price, discount } = body;
        const command = new PutItemCommand({
            TableName: tableName,
            Item: {
                roomId: { S: roomId },
                price: { N: price.toString() },
                discount: { N: discount.toString() }
            }
        });
        await client.send(command);
        return {
            statusCode: 201,
            headers: headers,
            body: JSON.stringify({ message: "Room added successfully" })
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: error.message })
        };
    }
};

const editRoom = async (body) => {
    try {
        const { roomId, price, discount } = body;
        const command = new UpdateItemCommand({
            TableName: tableName,
            Key: {
                roomId: { S: roomId }
            },
            UpdateExpression: "set price = :price, discount = :discount",
            ExpressionAttributeValues: {
                ":price": { N: price.toString() },
                ":discount": { N: discount.toString() }
            }
        });
        await client.send(command);
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: "Room updated successfully" })
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: error.message })
        };
    }
};

const deleteRoom = async (roomId) => {
    if (!roomId) {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ message: "Missing roomId parameter" })
        };
    }

    try {
        const command = new DeleteItemCommand({
            TableName: tableName,
            Key: {
                roomId: { S: roomId }
            }
        });
        await client.send(command);
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: "Room deleted successfully" })
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: error.message })
        };
    }
};
