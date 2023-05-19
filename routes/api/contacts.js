const express = require('express');
const ctrl = require('../../controllers/contacts');
const {validateBody, isValidId} = require('../../middlewares'); 
const {schemas} = require('../../models/contact'); 

const router = express.Router();

router.get('/', ctrl.getAllContacts); 

router.get('/:contactId', isValidId, ctrl.getContactById); 

router.post('/', validateBody(schemas.addSchema), ctrl.addContact); 

router.put('/:contactId', isValidId, validateBody(schemas.updateSchema),ctrl.updateContact);

router.delete('/:contactId',isValidId, ctrl.deleteContact);  

router.put('/:id', isValidId, validateBody(schemas.addSchema), ctrl.updateContact);

router.patch('/:id/favorite',isValidId, validateBody(schemas.updateFavoriteSchema),ctrl.updateStatusContact);

module.exports = router; 