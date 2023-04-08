import express from 'express'
import { registercontroller,
    logincontroller,
    testController,
    forgotPasswordController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController,} from "../controllers/authController.js"
import {requireSignIn,isAdmin} from '../middlewares/authMiddleware.js'
// router object
const router = express.Router()

// ROUTING
// Register || METHOD POST

router.post('/register',registercontroller)

// Login || METHOD POST

router.post('/login',logincontroller)

// Forgot Password || METHOD POST

router.post('/forgot-password',forgotPasswordController)

// test routes
router.get("/test",requireSignIn,isAdmin,testController)

// protected User routes
router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({"ok":true})
})
// protected Admin routes
router.get("/admin-auth",requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({"ok":true})
})

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);
export default router