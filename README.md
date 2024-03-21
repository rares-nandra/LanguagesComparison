# Programming Languages Comparison

This project aims to compare the performance of different programming languages in executing a prime number finder algorithm up to 100,000. It provides implementations of the algorithm in various languages for a fun speed comparison. The code is customizable enough that it allows you to add new languages with ease and change the expected output and the arguments used for running building and compiling them so it doesen't have to be all about prime numbers. The language configurations are in app/Languages/Config.json. You can visialize the data regarding compilation times, executable sizes and running times on a web page running on port 8080. Just build the docker container and have fun!

## Features

- Implementation of a prime number finder algorithm in multiple programming languages.
- Docker containerization for easy replication across devices.
- Customizable language configurations via `Config.json` file.
- Ability to add more languages and customize build and run commands.
- Flask server serving a webpage on `localhost:8080` for viewing compilation data and results.

## Usage

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run the Docker container using the provided Dockerfile.
4. Access the webpage served by the Flask server on `localhost:8080`.
5. View compilation data and compare results using bar charts.

## Configurations

- Modify `Config.json` inside the `languages` folder to add new languages or customize build and run commands.
- Customize arguments and verify output against expected output.

## Contributing

Contributions are welcome! Feel free to fork the repository, make changes, and submit pull requests.
