import os

def lambda_handler(event, context):
    stage_name = os.environ.get('stageName', 'Unknown')
    message = f"Hello! The stage name is {stage_name}."
    print(message)
    return {
        'statusCode': 200,
        'body': message
    }
