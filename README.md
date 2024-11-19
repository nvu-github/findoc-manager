# Project Setup

## Prerequisites

- Install Docker and ensure it is running.
- Node.js version 16 or higher is required.

## Setup Environment

1. Clone the repository and navigate into the project folder.

2. **Download Docker Environment**

   - Make sure Docker is installed and running on your machine.

3. **Install Node.js Packages**

   - Navigate to both `api` and `front-end` folders and run:
     ```sh
     npm i
     ```

4. **Docker Compose**

   - Run Docker Compose to set up the required services:
     ```sh
     docker compose up -d
     ```

5. **Create Environment Files**

   - Create `.env` files from the provided `.env.template` in both `api` and `front-end` folders.
   - Fill in the required configuration details in the `.env` files for both folders.

6. **Run Migration and Seed the Database (in the API folder)**
   - Navigate to the `api` folder and run:
     ```sh
     npx knex migrate:latest
     npx knex seed:run
     ```

## Starting the Application

1. **Start API**

   - Navigate to the `api` folder and run:
     ```sh
     npm run dev
     ```

2. **Start Front-End**
   - Navigate to the `front-end` folder and run:
     ```sh
     npm run dev
     ```

## Summary of Commands

```sh
# Install dependencies in both folders
cd api
npm i
cd ../front-end
npm i

# Start Docker
docker compose up -d

# Create environment files and fill in necessary information
# (copy .env.template to .env and edit)

# Run migrations and seed database in the api folder
cd ../api
npx knex migrate:latest
npx knex seed:run

# Start API
npm run dev

# Start Front-End
cd ../front-end
npm run dev
```
