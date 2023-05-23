const {Contact} = require('../models/contact'); 
const {HttpError, ctrlWrapper} = require('../utils');

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.find({owner}, '-createdAt -updatedAt').populate("owner", "email phone");
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findById({ _id: contactId, owner }); 
    if(!result) { 
      throw HttpError(404)
    }
    res.json(result);
}

const addContact = async (req, res) => { 
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result); 
}

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndRemove({ _id: contactId, owner });
  if (!result) {
    throw HttpError(404);
  }
  res.json({ message: "Delate success" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({ _id: contactId, owner }, req.body, {
    new: true,
  });
    if (!result) {
      throw HttpError(404);
  }
  res.json(result);
} 

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

  module.exports = { 
    getAllContacts: ctrlWrapper(getAllContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    deleteContact: ctrlWrapper(deleteContact), 
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact: ctrlWrapper(updateStatusContact),
  }