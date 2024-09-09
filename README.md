# Development of a Data Analysis Module for AI Models

This project addresses the challenge of managing and analyzing high-dimensional image data, with a focus on creating embeddings and performing similarity searches. The module developed here allows for the transformation of large image datasets into vector embeddings, providing enhanced capabilities for similarity search and interactive data visualization.

## Project Overview

The system developed includes:
- A **Compute Engine** that uses machine learning models to compute embeddings from high-dimensional image data.
- An **Interactive Data Visualization Module** using Plotly to allow users to explore complex data in a 3D space.
- A **Similarity Search Feature** enabling efficient image comparison based on embeddings.

## Features

- **High-Dimensional Data Analysis**: Efficient computation of vector embeddings to manage large image datasets.
- **Similarity Search**: Allows users to search for similar images based on precomputed embeddings.
- **Data Visualization**: Interactive 3D visualizations of image clusters.
- **User-Friendly Interface**: Intuitive web interface for easy interaction with the system.

## Technologies

- **Backend**: Python (Django, Numpy)
- **Frontend**: React.js, Plotly for data visualization
- **Storage**: Amazon S3 for image data, SQLite for metadata
- **Machine Learning Models**: ResNet18 for feature extraction

## Installation and Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo-name/project-name.git
    cd project-name
    ```

2. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3. Set up the database:
    ```bash
    python manage.py migrate
    ```

4. Run the development server:
    ```bash
    python manage.py runserver
    ```

5. Open your browser and navigate to `http://localhost:8000` to use the application.

## Usage

- Upload an image via the interface to perform similarity searches.
- Visualize image clusters in 3D based on the embeddings generated.
- Filter and inspect specific data points for detailed metadata and similarity scores.

## Future Improvements

- Expansion of supported AI models for embedding generation.
- Improved scalability to handle larger datasets.
- Enhanced security and privacy features.

## License

This project is licensed under the MIT License.
