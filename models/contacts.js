const fs = require("fs/promises")
const path = require("path"); 
const crypto = require('crypto'); 

const contactsPath = path.join(__dirname, 'contacts.json'); 

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((c) => c.id === contactId);
    return contact ? { ...contact } : null; 
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) return null;
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}

async function addContact(contact) {
  const contacts = await listContacts();
  const id = crypto.randomBytes(8).toString('hex');
  const newContact = { id, ...contact };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function updateContactById(contactId, body) {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId.toString());

  if (index === -1) return null;
  contacts[index] = { ...contacts[index], ...body };

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById, 
};