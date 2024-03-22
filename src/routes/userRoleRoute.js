const { Router } = require('express');
const userRoleController = require('../controllers/userRoleController');
const verifyAuth = require('../middlewares/verifyAuth');

const router = Router();

router
    .get('/', userRoleController.get)
    .post('/', verifyAuth, userRoleController.add)
    .delete('/:id', verifyAuth, userRoleController.delete);

module.exports = router;
