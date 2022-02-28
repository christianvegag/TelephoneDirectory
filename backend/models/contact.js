import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  mobile: Number,
  registerDate: { type: Date, default: Date.now },
  modifyDate: { type: Date, default: Date.now },
});

const contact = mongoose.model("contacts", contactSchema);

export default contact;
