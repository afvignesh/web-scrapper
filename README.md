# Web Crawler Application

This is a web scrapper application that scrapes data from specified URLs. The application is built with Node.js and provides functionality for scraping both JSON and HTML files. It also includes a test suite to validate the functionality and a mock server to simulate external services.

## Features

- Scrapes JSON and HTML files from specified URLs.
- Supports retrying failed requests with exponential backoff.
- Mock server for local testing and development.
- Git hub action for code push.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 12.x or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:afvignesh/web-scrapper.git
   cd web-crawler
   ```
2. Install necessary dependencies:
   ```bash
    npm install
   ```

## Usage

1. Start the mock server
    ```bash
    npm run start-server
    ```
    
2. Start scraping
    You need to add the list of urls to be scrapped in `urls.txt` and then run the following command
    ```bash
    npm start
    ```
    
2. Test application
    You can run test cases using following command: 
    ```bash
    npm test
    ```

