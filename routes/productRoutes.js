import express from 'express'

const router = express.Router()
import cloudinary from '../utils/cloudinary.js';
import productModel from "../models/productModel.js"


import slugify from "slugify";
import {storage} from "../utils/multer.js";

import {
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,} from "../controllers/productController.js"
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';



router.post("/create-product",  requireSignIn,
isAdmin, storage.single("image"), createProductController);

router.get("/getAll-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);

router.put(
    "/update-product/:pid",
    requireSignIn,isAdmin,
    storage.single("image"),
    updateProductController,
   
  )
  
//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

// similar product
router.get("/related-product/:pid/:cid", realtedProductController);

// //category wise product
router.get("/product-category/:slug", productCategoryController);

// //payments routes
// //token
router.get("/braintree/token", braintreeTokenController);

// //payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);


export default router