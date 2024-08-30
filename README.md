# 🖥️ Backend Image Processor

### 💾 What?
This application deploys a Postgres database and the backend application using Docker Compose. It provides three routes:
- An upload route that accepts an image of a water or gas meter reading and uses the Google Gemini API to identify the measurement value.
- A confirm route that accepts a measurement value, allowing users to confirm or correct the AI-generated result.
- A list route that returns all measurements associated with a customer, with an optional query parameter to filter by measurement type (gas or water).

### 💨 Run?
If you want to run in your machine, just clone it from github and type on the terminal:
     docker-compose up -d
     

### 💧 Who?
This project was made by me Juliana Daroz (https://www.linkedin.com/in/julianadaroz/) based on a technical test I received.