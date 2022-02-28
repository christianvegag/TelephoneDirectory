import Contact from "../models/contact.js";
import contactMidd from "../middlewares/contact.js";

const addContact = async (req, res) => {
  const schema = new Contact({
    name: req.body.name,
    phone: req.body.phone,
    mobile: req.body.mobile,
  });

  const result = await schema.save();
  return result
    ? res.status(201).send({ message: "Contact registered" })
    : res.status(500).send({ message: "Failed to register contact" });
};

const existContact = async (req, res) => {
  const contact = await Contact.findOne({
    name: req.params["name"],
  });
  return contact
    ? res.status(200).send({ message: "This contact is already registered" })
    : res.status(404).send({ message: "This contact is not registered" });
};

const listContact = async (req, res) => {
  const contacts = await Contact.find();
  return contacts.length > 0
    ? res.status(200).send({ contacts })
    : res.status(404).send({ message: "No contacts" });
};

const searchContact = async (req, res) => {
  const contact = await Contact.findOne(
    {
      name: req.params["name"],
    },
    { phone: 1, mobile: 1, _id: 0 }
  );
  return contact
    ? res.status(200).send({ contact })
    : res.status(404).send({ message: "Contact no found" });
};

const updateContact = async (req, res) => {
  const edit = await Contact.findByIdAndUpdate(
    {
      _id: req.params["_id"],
    },
    { name: req.body.name, phone: req.body.phone, mobile: req.body.mobile, modifyDate: new Date()}
  );

  return edit
    ? res.status(201).send({ message: "Contact modified" })
    : res.status(400).send({ message: "Failed to modified contact" });
};

const deleteContact = async (req, res) => {
  const contact = await Contact.findOneAndDelete({ _id: req.params["_id"] });
  return contact
    ? res.status(200).send({ message: "Contact deleted" })
    : res.status(400).send({ message: "Failed to delete contact" });
};

const capacityContact = async (req, res) => {
  return res.status(400).send({ message: "The directory is not full" });
};

const spaceContact = async (req, res) => {
  const space = contactMidd.limit - (await Contact.count());
  return res
    .status(400)
    .send({ message: "You can add " + space + " more contacts" });
};

export default {
  addContact,
  existContact,
  listContact,
  searchContact,
  updateContact,
  deleteContact,
  capacityContact,
  spaceContact,
};
