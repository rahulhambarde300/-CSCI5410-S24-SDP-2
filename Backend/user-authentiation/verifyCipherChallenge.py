import json
import hashlib
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')

def lambda_handler(event, context):
    data = json.loads(event['body'])
    email = data['email']
    user_answer = data['answer']
    
    response = table.get_item(Key={'email': email})
    item = response.get('Item', {})
    
    if not item:
        return {
            'statusCode': 400,
            'body': json.dumps({'success': False, 'message': 'Invalid request.'})
        }
    
    hashed_user_answer = hashlib.sha256(user_answer.encode()).hexdigest()
    
    if hashed_user_answer == item['hashed_answer']:
        return {
            'statusCode': 200,
            'body': json.dumps({'success': True, 'username': email})
        }
    else:
        return {
            'statusCode': 400,
            'body': json.dumps({'success': False, 'message': 'Incorrect answer.'})
        }
