import express from "express";
import contact from "../controllers/contact.js";
import contactMidd from "../middlewares/contact.js";

const router = express.Router();

router.post(
  "/add",
  contactMidd.validContact,
  contactMidd.existingContact,
  contactMidd.maxCapacity,
  contact.addContact
);
router.get("/exist/:name?", contact.existContact);
router.get("/list", contact.listContact);
router.get("/search/:name?", contact.searchContact);
router.put(
  "/update/:_id",
  contactMidd.validContact,
  contactMidd.existingContact,
  contact.updateContact
);
router.delete("/delete/:_id", contact.deleteContact);
router.get("/capacity", contactMidd.maxCapacity, contact.capacityContact);
router.get("/space", contactMidd.maxCapacity, contact.spaceContact);

export default router;
