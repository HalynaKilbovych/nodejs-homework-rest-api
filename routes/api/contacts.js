const express = require('express');
const ctrl = require('../../controllers/contacts');
const {validateBody, isValidId} = require('../../middlewares'); 
const {schemas} = require('../../models/contact'); 

const router = express.Router();

const authenticate = require('../../middlewares/authenticate'); 

router.get('/', authenticate, ctrl.getAllContacts); 

router.get('/:contactId', authenticate, isValidId, ctrl.getContactById); 

router.post('/',authenticate,  validateBody(schemas.addSchema), ctrl.addContact); 

router.put('/:contactId', authenticate,  isValidId, validateBody(schemas.updateSchema),ctrl.updateContact);

router.delete('/:contactId',authenticate, isValidId, ctrl.deleteContact);  

router.patch('/:contactId/favorite',authenticate, isValidId, validateBody(schemas.updateFavoriteSchema),ctrl.updateStatusContact);

module.exports = router; 