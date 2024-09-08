import logging
import boto3
from botocore.exceptions import ClientError
from django.conf import settings
import concurrent.futures


session = boto3.Session(
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
    )

def create_presigned_url(bucket_name, object_name, expiration=3600):
    """Generate a presigned URL to share an S3 object

    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Presigned URL as string. If error, returns None.
    """

    # Generate a presigned URL for the S3 object
    s3_client = session.client('s3')
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL
    return response

def generate_results_with_presigned_urls(distances, num_k, model_id):
    bucket_name = 'vinai-vinuni-dms-test'
    base_s3_path = 'raw/OCC' if model_id == 1 else 'raw/AIC'
    local_base_path = '/home/ubuntu/20thao.nt/OCC' if model_id == 1 else '/home/ubuntu/20thao.nt/AIC/AIC_frames_cut'

    response = []

    for score, label, path in distances[:num_k]:
        # Replace local base path with S3 base path
        s3_relative_path = path.replace(local_base_path, base_s3_path)
        # Create the presigned URL
        presigned_url = create_presigned_url(bucket_name, s3_relative_path)
        # Extract the file name
        file_name = path.split('/')[-1]
        # Append the result
        response.append({
            'presigned_url': presigned_url if presigned_url else 'Error generating presigned URL',
            'file_name': file_name,
            'label': label,
            'similarity_score': score
        })

    # Return the results as a JSON response
    return response


def generate_presigned_url(path, bucket_name, base_s3_path, model_id):
    if model_id == 1:
        s3_relative_path = path.replace('/home/ubuntu/20thao.nt/OCC', base_s3_path)
    else:
        s3_relative_path = path.replace('/home/ubuntu/20thao.nt/AIC/AIC_frames_cut', base_s3_path)
    return create_presigned_url(bucket_name, s3_relative_path)

def generate_presigned_urls(image_paths, model_id):
    bucket_name = 'vinai-vinuni-dms-test'
    base_s3_path = 'raw/OCC' if model_id == 1 else 'raw/AIC'
    presigned_urls = [None] * len(image_paths)

    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_index = {executor.submit(generate_presigned_url, path, bucket_name, base_s3_path, model_id): idx for idx, path in enumerate(image_paths)}
        for future in concurrent.futures.as_completed(future_to_index):
            idx = future_to_index[future]
            try:
                presigned_urls[idx] = future.result() or 'Error generating presigned URL'
            except Exception as exc:
                print(f'{image_paths[idx]} generated an exception: {exc}')
                presigned_urls[idx] = 'Error generating presigned URL'

    return presigned_urls