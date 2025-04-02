# Project Setup

## 1. Create a Project

Start by creating a new project in your preferred environment.

## 2. Web App Name and Hosting

Specify your web app name and hosting provider (e.g., Vercel).

## 3. Install Appwrite SDK

In your Vite project, run the following command:

```sh
npm i appwrite
```

## 4. Configure Appwrite

Create a new file at `src/appwrite/config.js` and add the following:

```js
import { Client, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("YOUR_PROJECT_ID"); // Your project ID

export { client };
```

Your API Endpoint and Project ID will be available in the Appwrite console.

## 5. Setup Database

1. Go to Appwrite.
2. In the **Database** section, create a new database.
3. Give it a name (you can leave the ID blank; Appwrite will generate one).
4. Create a new collection.
5. Give it a name (ID can be left blank as well).

## 6. Create Schema

1. Open your collection and go to the **Attributes** section.
2. Click **Add Attribute**.
3. Select **String**.
4. Set its properties (name, ID, size, default value).
5. Click **Create**.
6. Repeat for all required attributes (e.g., two strings and a boolean for completion).
7. Click **Save**.

## 7. Add Documents

1. Go to **Documents** in your collection.
2. Click **Create Document**.
3. Set its body and define default values (e.g., `true` or `false` for note completion).
4. Repeat for all required documents.
5. Click **Save**.

//////////////////////////////////////////////////////////////////////////////////
now go to settings,as we need to set the permissions
