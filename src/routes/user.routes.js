const router = require('express').Router();
const {singIn, confirmar, singUp, forgotpassword, resetpassword, logout} = require('../controllers/user.controller')
const authMiddleware = require('../middleware/user.middleware')

router.post(
    '/register',
    [],
    singUp
)
router.get(
    '/confirm/:token',
    [],
    confirmar
);
router.post(
    '/auth',
    [],
    authMiddleware,
    singIn
)

  
module.exports = router;