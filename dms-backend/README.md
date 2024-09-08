## Usage in cecs server 

1. If the server shuts down when someone is working, the port might affect other users or later sessions. Use this to kill all process in port 8000: `kill $(lsof -t -i:8000)`.

2. Create a new `.env` file. Copy the content of the `.env.dev` file into the `.env` one. For `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` please ping me.

3. Change to the correct virtual environment by running: `conda activate myenv`.

4. Go to the 'dms-backend' directory and run: `python manage.py runserver`.

5. (Optional) Forward port 8000 to local: `ssh -L 8000:localhost:8000 -p 50063 ubuntu@100.105.166.20`


# Image Processing Backend Project

## Overview
This project provides a backend for image processing tasks, including image upload, image querying, image classification, and similarity search. The project uses Django Rest Framework (DRF) to create APIs for handling these tasks.

## Setup Instructions

### Prerequisites

- absl-py==1.4.0
- accelerate==0.29.3
- aiohttp==3.9.5
- aiosignal==1.3.1
- asgiref==3.8.1
- asttokens @ file:///home/conda/feedstock_root/build_artifacts/asttokens_1698341106958/work
- astunparse==1.6.3
- async-timeout==4.0.3
- attrs==23.2.0
- backcall @ file:///home/conda/feedstock_root/build_artifacts/backcall_1592338393461/work
- backports.zoneinfo==0.2.1
- boto3==1.34.101
- botocore==1.34.101
- cachetools==5.3.3
- certifi @ file:///croot/certifi_1707229174982/work/certifi
- charset-normalizer @ file:///tmp/build/80754af9/charset-normalizer_1630003229654/work
- cjm-pandas-utils==0.0.3
- cjm-pil-utils==0.0.9
- cjm-psl-utils==0.0.2
- cjm-pytorch-utils==0.0.5
- click==8.1.7
- coloredlogs==15.0.1
- comm @ file:///home/conda/feedstock_root/build_artifacts/comm_1710320294760/work
- contextlib2==21.6.0
- contourpy==1.1.1
- cycler==0.12.1
- datasets==2.19.0
- debugpy @ file:///croot/debugpy_1690905042057/work
- decorator @ file:///home/conda/feedstock_root/build_artifacts/decorator_1641555617451/work
- diffusers==0.27.2
- dill==0.3.8
- Django==4.2.11
- django-cors-headers==4.3.1
- django-environ==0.11.2
- django-storages==1.14.3
- djangorestframework==3.15.1
- entrypoints @ file:///home/conda/feedstock_root/build_artifacts/entrypoints_1643888246732/work
- etils==1.3.0
- evaluate==0.4.1
- executing @ file:///home/conda/feedstock_root/build_artifacts/executing_1698579936712/work
- Faker==24.9.0
- filelock @ file:///croot/filelock_1700591183607/work
- flatbuffers==24.3.7
- fonttools==4.50.0
- frozenlist==1.4.1
- fsspec==2024.3.1
- gast==0.4.0
- gmpy2 @ file:///tmp/build/80754af9/gmpy2_1645455532332/work
- google-auth==2.29.0
- google-auth-oauthlib==1.0.0
- google-pasta==0.2.0
- googleapis-common-protos==1.63.0
- grpcio==1.62.1
- h5py==3.11.0
- huggingface-hub==0.21.4
- humanfriendly==10.0
- idna @ file:///croot/idna_1666125576474/work
- importlib_metadata==7.1.0
- importlib_resources==6.4.0
- ipykernel @ file:///home/conda/feedstock_root/build_artifacts/ipykernel_1708996548741/work
- ipython @ file:///home/conda/feedstock_root/build_artifacts/ipython_1680185408135/work
- jedi @ file:///home/conda/feedstock_root/build_artifacts/jedi_1696326070614/work
- Jinja2 @ file:///croot/jinja2_1706733616596/work
- jmespath==1.0.1
- joblib==1.3.2
- jupyter-client @ file:///home/conda/feedstock_root/build_artifacts/jupyter_client_1654730843242/work
- jupyter_core @ file:///home/conda/feedstock_root/build_artifacts/jupyter_core_1710257397447/work
- keras==2.13.1
- Keras-Applications==1.0.8
- keras-contrib @ git+https://www.github.com/keras-team/keras-contrib.git@3fc5ef709e061416f4bc8a92ca3750c824b5d2b0
- Keras-Preprocessing==1.1.2
- kiwisolver==1.4.5
- libclang==18.1.1
- lightning-utilities==0.11.2
- Markdown==3.6
- markdown-it-py==3.0.0
- MarkupSafe @ file:///croot/markupsafe_1704205993651/work
- matplotlib==3.7.5
- matplotlib-inline @ file:///home/conda/feedstock_root/build_artifacts/matplotlib-inline_1713250518406/work
- mdurl==0.1.2
- mkl-fft @ file:///croot/mkl_fft_1695058164594/work
- mkl-random @ file:///croot/mkl_random_1695059800811/work
- mkl-service==2.4.0
- ml-collections==0.1.1
- mpmath @ file:///croot/mpmath_1690848262763/work
- multidict==6.0.5
- multiprocess==0.70.16
- mypy-extensions==1.0.0
- nest_asyncio @ file:///home/conda/feedstock_root/build_artifacts/nest-asyncio_1705850609492/work
- networkx @ file:///croot/networkx_1690561992265/work
- nltk==3.8.1
- numpy @ file:///work/mkl/numpy_and_numpy_base_1682953417311/work
- nvidia-cublas-cu12==12.1.3.1
- nvidia-cuda-cupti-cu12==12.1.105
- nvidia-cuda-nvrtc-cu12==12.1.105
- nvidia-cuda-runtime-cu12==12.1.105
- nvidia-cudnn-cu12==8.9.2.26
- nvidia-cufft-cu12==11.0.2.54
- nvidia-curand-cu12==10.3.2.106
- nvidia-cusolver-cu12==11.4.5.107
- nvidia-cusparse-cu12==12.1.0.106
- nvidia-nccl-cu12==2.20.5
- nvidia-nvjitlink-cu12==12.4.127
- nvidia-nvtx-cu12==12.1.105
- oauthlib==3.2.2
- onnx==1.15.0
- onnxruntime==1.17.1
- onnxsim==0.4.36
- opencv-python==4.9.0.80
- opt-einsum==3.3.0
- packaging @ file:///home/conda/feedstock_root/build_artifacts/packaging_1710075952259/work
- pandas==2.0.3
- parso @ file:///home/conda/feedstock_root/build_artifacts/parso_1712320355065/work
- pexpect @ file:///home/conda/feedstock_root/build_artifacts/pexpect_1706113125309/work
- pickleshare @ file:///home/conda/feedstock_root/build_artifacts/pickleshare_1602536217715/work
- pillow @ file:///croot/pillow_1707233021655/work
- platformdirs @ file:///home/conda/feedstock_root/build_artifacts/platformdirs_1713912794367/work
- promise==2.3
- prompt-toolkit @ file:///home/conda/feedstock_root/build_artifacts/prompt-toolkit_1702399386289/work
- protobuf==3.20.3
- psutil @ file:///opt/conda/conda-bld/psutil_1656431268089/work
- ptyprocess @ file:///home/conda/feedstock_root/build_artifacts/ptyprocess_1609419310487/work/dist/ptyprocess-0.7.0-py2.py3-none-any.whl
- pure-eval @ file:///home/conda/feedstock_root/build_artifacts/pure_eval_1642875951954/work
- pyarrow==16.0.0
- pyarrow-hotfix==0.6
- pyasn1==0.5.1
- pyasn1-modules==0.3.0
- Pygments @ file:///home/conda/feedstock_root/build_artifacts/pygments_1700607939962/work
- pyparsing==3.1.2
- pyre-extensions==0.9.0
- python-dateutil @ file:///home/conda/feedstock_root/build_artifacts/python-dateutil_1709299778482/work
- pytz==2024.1
- PyYAML @ file:///croot/pyyaml_1698096049011/work
- pyzmq @ file:///croot/pyzmq_1705605076900/work
- regex==2024.4.16
- requests @ file:///croot/requests_1707355572290/work
- requests-oauthlib==2.0.0
- responses==0.18.0
- rich==13.7.1
- rouge-score==0.1.2
- rsa==4.9
- s3transfer==0.10.1
- safetensors==0.4.2
- scikit-learn==1.3.2
- scipy==1.10.1
- seaborn==0.13.2
- six @ file:///home/conda/feedstock_root/build_artifacts/six_1620240208055/work
- sqlparse==0.4.4
- stack-data @ file:///home/conda/feedstock_root/build_artifacts/stack_data_1669632077133/work
- sympy @ file:///croot/sympy_1701397643339/work
- tensorboard==2.13.0
- tensorboard-data-server==0.7.2
- tensorflow==2.13.1
- tensorflow-datasets==4.7.0
- tensorflow-estimator==2.13.0
- tensorflow-io-gcs-filesystem==0.34.0
- tensorflow-metadata==1.14.0
- termcolor==2.4.0
- threadpoolctl==3.4.0
- timm==0.9.16
- tokenizers==0.19.1
- toml==0.10.2
- torch==2.2.2
- torchaudio==2.2.2
- torcheval==0.0.7
- torchmetrics==1.3.2
- torchtnt==0.2.0
- torchvision==0.17.2
- tornado @ file:///home/conda/feedstock_root/build_artifacts/tornado_1648827257044/work
- tqdm==4.66.2
- traitlets @ file:///home/conda/feedstock_root/build_artifacts/traitlets_1713535121073/work
- transformers==4.40.1
- triton==2.2.0
- ttach==0.0.3
- typing-inspect==0.9.0
- typing_extensions==4.11.0
- tzdata==2024.1
- urllib3==1.26.18
- wcwidth @ file:///home/conda/feedstock_root/build_artifacts/wcwidth_1704731205417/work
- Werkzeug==3.0.1
- wrapt==1.16.0
- xxhash==3.4.1
- yarl==1.9.4
- zipp==3.18.1


### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Create a virtual environment and activate it:
    ```sh
    python3 -m venv venv
    source venv/bin/activate
    ```

3. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```

4. Apply migrations:
    ```sh
    python manage.py migrate
    ```

5. Run the server:
    ```sh
    python manage.py runserver
    ```

## API Endpoints

### Image Classification

- **Endpoint:** `/api/v1/images/classify`
- **Method:** POST
- **Description:** Classify an image using an ONNX model.
- **Example Request:**
  ```json
  {
    "image_path": "/path/to/image.jpg"
  }
  ```
- **Response:**
  ```json
  {
    "class": "label",
    "confidence": 0.95
  }
  ```

### Similarity Search

- **Endpoint:** `/api/v1/images/search2`
- **Method:** POST
- **Description:** Upload an image and return the most similar images from the dataset.
- **Example Request:**
  ```json
  {
    "image_file": "<uploaded-file>",
    "model_id": "1",
    "num_k": 5
  }
  ```
- **Response:**
  ```json
  {
    "results": [
      {
        "path": "path/to/similar/image.jpg",
        "tags": "label",
        "similarity_score": 0.1234
      }
    ]
  }
  ```

### Image Features

- **Endpoint:** `/api/v1/images/features2`
- **Method:** GET
- **Description:** Get all the features and their PCA attributes.
- **Example Request:**
  ```json
  {"model_id": "1"}
  ```
- **Response:**
  ```json
  [
    {
      "features": [0.1, 0.2, 0.3, ...],
      "labels": "label",
      "image_path": "path/to/image.jpg",
      "cluster_labels": "cluster-label",
      "presigned_url": "https://example.com/presigned-url"
    },
    {
      "features": [0.2, 0.3, 0.4, ...],
      "labels": "label",
      "image_path": "path/to/image2.jpg",
      "cluster_labels": "cluster-label",
      "presigned_url": "https://example.com/presigned-url2"
    },
    ...
  ]
  ```

  
## Data Files
- features.npz: Contains all features of images.
- reduced_features.npz: Contains PCA-reduced features of images.
- save_pca.py: Script used to save PCA-reduced features.
## Notes
- Images metadata (with its features) are currently stored in NumPy arrays and also SQLite, which can be migrated to a vector database like Milvus if needed.

