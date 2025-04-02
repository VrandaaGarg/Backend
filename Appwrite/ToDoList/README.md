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

## 8. Configure Permissions

1. Navigate to **Settings** in Appwrite.
2. Set **Permissions** for your collection:
   - Allow any user (authenticated or not) to create, read, update, and delete.
   - Later, restrict this to authenticated users only.
3. Click **Update**.

## 9. Complete Configuration in React

Now, start integrating the Appwrite configuration in your React project.

## Update `config.js`

Move to `config.js` and update the import statement:

```js
import { Client, Databases } from "appwrite";
```

Now, add the following:

```js
const databases = new Databases(client);
export { client, databases };
```

## Create `.env` File

Create a `.env` file to store your project ID and endpoint:

```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=YOUR_PROJECT_ID
VITE_APPWRITE_DATABASE_ID=YOUR_DATABASE_ID
```

### Retrieve Database ID

Go to Appwrite, click on **Database**, and copy the **Database ID**.

Then, add the collection ID:

```
VITE_APPWRITE_COLLECTION_ID=YOUR_COLLECTION_ID
```

Save the file.

## Final `config.js` Setup

Update `config.js` with the following:

```js
import { Client, Databases } from "appwrite";

const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Your API Endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Your project ID

const databases = new Databases(client);
export { client, databases };
```

## Next Steps

Now, we will start making requests to Appwrite.
