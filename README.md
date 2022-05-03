## Setup
- **Pre-Requisite**
  - For dockerized environment we need 
    - `docker`, 
    - `docker-compose` installed.
  - To run API server without Docker we need
    - `Node.js` (>= 10.13.0) installed,
    - Dependency manager `npm` installed,
    - Nestjs CLI `nest` installed ([follow here](https://docs.nestjs.com/first-steps)) and
    - MySQL server running
- **Configuration**
    - In application root, create `.env` copying form example env file `env.example`.
    - An example env file contains 
      - MySQL credentials for the dockerized environment. For non-docker setup, **update MySQL credentials** here.

- **Run API**
    - **For Docker**: Up docker-compose, this will create a docker container with the database with the given name in env. 
    ``` 
    $ docker-compose up --build
    ```

    - For non-docker run install dependencies and run nodejs API server
    ```
    $ npm
    $ npm run start:dev
    ```
- **API Documentation**
    - To get API documentation, run following command & browse
    ```
    $ npm run compodoc
    ```
- **API** 
  With above steps done, API should be up and running
    - Browse `API` at [http://localhost:3000](http://localhost:3000)
    - Browse `Swagger Open API` Doc at [http://localhost:3000/api](http://localhost:3000/api)
    - Browse (for Docker only) DB `Adminer` at [http://localhost:8080](http://localhost:8080)
