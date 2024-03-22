const { Router } = require('express');
const authController = require('../controllers/authController');
const verifyAuth  = require('../middlewares/verifyAuth');

const router = Router();

router
    .post('/signup', authController.signup_post)
    .post('/login', authController.login_post)
    .post('/logout', verifyAuth, authController.logout_post)
    .post('/crypt', authController.crypt)

module.exports = router;
