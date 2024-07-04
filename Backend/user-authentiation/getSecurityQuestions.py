import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')

def lambda_handler(event, context):
    print(json.dumps(event))
    body = json.loads(event['body'])
    user_email = body['email']

    response = table.get_item(
        Key={'email': user_email}
    )
    
    if 'Item' in response:
        user_details = response['Item']
        security_questions = user_details['securityQuestions']
        return {
            'statusCode': 200,
            'body': json.dumps(security_questions)
        }
    else:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'User not found'})
        }
