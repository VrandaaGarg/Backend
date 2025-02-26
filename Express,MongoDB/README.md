# NOTES

# Setup Instructions

### 1. Initialization

```sh
npm init
```

- If asked for entry point, set it to `server.js`.

### 2. Setting Up Files

```sh
# Create .gitignore file and include the following:
/node_modules
.env
```

- Create `server.js` file.

### 3. Install Express

```sh
npm i express
```

- In `package.json`, add the following scripts:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### 4. Save and Run

```sh
npm run dev
```

### 5. Setting Up `server.js`

```js
const express = require("express");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
```

### 6. Create `.env` File

```sh
# Install dotenv
npm i dotenv
```

- Inside `.env` file, add:

```sh
PORT=5001
```

### 7. Setting Up Models, Routes, and Controllers

- Organize your project structure into:
  - `models/`
  - `routes/`
  - `controllers/`

### 8. Connect to Database

- Implement your database connection logic accordingly.

### 9. Setting Up MongoDB

- Setup a username and secure password.
- Create a cluster.
- Go to **Browse Collections**.
- Add your own data.
- Add a database name, e.g., `mycontact-backend`, and a collection name, e.g., `contacts`.

### 10. Connecting to the Database

- Navigate to **Overview** -> **Connect** -> **Connect using MongoDB Compass** -> Copy the connection string.
- In VS Code, click on **Add Connection**.
- Edit the URL to include your password and at the end after `/`, add the database name, e.g., `mycontact-backend`.
- Go to **Connect** -> **MongoDB Native Driver** and copy the connection URL.
- In the `.env` file, add:

```sh
CONNECTION_STRING=<your_connection_string>
```

- Edit the URL: add your password and between `/?` add the database name, e.g., `/mycontact-backend?`.
- Create a file `/config/dbConnection.js` and write the code to connect to the database.

## Explanation of Dependencies

- **express** → For backend server.
- **mongoose** → To interact with MongoDB.
- **dotenv** → For environment variables.
- **cors** → Allows frontend to communicate with backend.
- **jsonwebtoken** → For user authentication.
- **bcryptjs** → To hash passwords securely.
- **body-parser** → Parses incoming request data.
- **cookie-parser** → Handles cookies in Express.

## Contacts API

This API provides CRUD (Create, Read, Update, Delete) operations for managing contacts.

### Endpoints and HTTP Methods

| CRUD Action      | HTTP Method | Endpoint            |
| ---------------- | ----------- | ------------------- |
| Get all contacts | GET         | `/api/contacts`     |
| Get contact      | GET         | `/api/contacts/:id` |
| Create contact   | POST        | `/api/contacts`     |
| Update contact   | PUT         | `/api/contacts/:id` |
| Delete contact   | DELETE      | `/api/contacts/:id` |

## Description

- **GET `/api/contacts`** - Retrieves a list of all contacts.
- **GET `/api/contacts/:id`** - Retrieves a single contact by ID.
- **POST `/api/contacts`** - Creates a new contact.
- **PUT `/api/contacts/:id`** - Updates an existing contact.
- **DELETE `/api/contacts/:id`** - Deletes a contact.

## License

This project is open-source and available under the MIT License.
