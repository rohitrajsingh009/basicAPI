import express from 'express';
const router = express.Router();
import UserController from '../controller/userController.js';
import checkUserAuth from '../middleware/auth-middleware.js';

// route level middleware 
router.use('/change-password', checkUserAuth )
router.use('/loggedUser',checkUserAuth)
// public routes --bina login ke use hoga
router.post('/register', UserController.userRegistration)
router.post('/login',UserController.userLogin)
router.post('/connect',UserController.userConnect)
router.post('/send-password-reset-email',UserController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token',UserController.userPasswordReset)
// private routes
router.post('/change-password',UserController.changeUserPassword)
router.get('/loggedUser',UserController.loggedUser)
export default router