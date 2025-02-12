//Here we will use ErrorHnadler middleware to handle the error
//Also db connection is established in server.js

const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");

const app = express();
connectDB();

const port = process.env.PORT || 5000;

app.use(express.json()); //helps to parse the json data
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
