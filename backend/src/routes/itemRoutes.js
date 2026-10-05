const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const validateId = require('../middlewares/validateId');

router.get('/', itemController.getAll);
router.get('/:id', validateId, itemController.getById);
router.post('/', itemController.create);
router.put('/:id', validateId, itemController.update);
router.delete('/:id', validateId, itemController.remove);

module.exports = router;
