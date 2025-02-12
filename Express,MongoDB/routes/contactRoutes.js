//Step3: Create the routes for the contacts

const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

//These are the routes for the contacts

router.route("/").get(getContacts).post(createContact);

router.route("/:id").post(updateContact).get(getContact).delete(deleteContact);

module.exports = router;
