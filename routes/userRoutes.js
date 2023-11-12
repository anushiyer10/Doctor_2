const express = require('express');
const {loginController, registerController,authController,applyDoctorControl} = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

// router onject
const router = express.Router()

//routes
//LOGIN || POST
router.post('/login',loginController)

// REGISTER || POST
router.post('/register',registerController)

// Auth || POST
router.post('/getUserData',authMiddleware,authController)

router.post('/apply-doctor',authMiddleware,applyDoctorControl)

module.exports = router;
