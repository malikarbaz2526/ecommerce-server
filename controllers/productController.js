import productModel from "../models/productModel.js"
import categoryModel from '../models/categoryModel.js'
import braintree from 'braintree'
import slugify from "slugify";
import cloudinary from "../utils/cloudinary.js";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.Merchant_ID,
  publicKey: process.env.Public_Key,
  privateKey: process.env.Private_Key,
});

export const createProductController = async (req, res) => {
    try {
   
        // Create new user
        const { name, description, price, category, quantity, shipping,image } =
        req.body;
    
        
      //alidation
      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !price:
          return res.status(500).send({ error: "Price is Required" });
        case !category:
          return res.status(500).send({ error: "Category is Required" });
        case !quantity:
          return res.status(500).send({ error: "Quantity is Required" });
          case image:
          return res.status(500).send({ error: "image is Required" });
        // case image && image.size > 1000000:
        //   return res
        //     .status(500)
        //     .send({ error: "image is Required and should be less then 1mb" });
      }
       // Upload image to cloudinary
       const result = await cloudinary.uploader.upload(req.file.path);
    
      const products = new productModel({ ...req.body,
          photo: result.secure_url,
          slug: slugify(name),
          cloudinary_id: result.public_id, });
        // let user = new User({
        //   name: req.body.name,
        //   photo: result.secure_url,
        //   cloudinary_id: result.public_id,
        // });
        // Save user
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
          })
      }catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error in crearing product",
        });
      }
};
// get all product
export const getProductController = async (req, res) => {
    try {
        const products = await productModel
          .find({})
          .populate("category")
          // .select("photo")
          .limit(12)
          .sort({ createdAt: -1 });
        res.status(200).send({
          success: true,
          counTotal: products.length,
          message: "ALlProducts ",
          products,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Erorr in getting products",
          error: error.message,
        });
      }
};
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      // .select("photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    
      res.status(200).send(product.photo);
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

//delete controller
export const deleteProductController = async (req, res) => {
  try {
   
      //     // Find user by id
      //     let product = await productModel.findById(req.params.id);
      //     // Delete image from cloudinary
      //     await cloudinary.uploader.destroy(product.cloudinary_id);
      //     // Delete user from db
      //     await product.remove();
      //     res.json(user);
  // Find user by id
  let product = await productModel.findById(req.params.pid).select("-photo");
// Delete image from cloudinary
        await cloudinary.uploader.destroy(product.cloudinary_id);
        // Delete user from db
      await product.remove();
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//upate producta
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping} =
    req.body;

  //alidation
  switch (true) {
    case !name:
      return res.status(500).send({ error: "Name is Required" });
    case !description:
      return res.status(500).send({ error: "Description is Required" });
    case !price:
      return res.status(500).send({ error: "Price is Required" });
    case !category:
      return res.status(500).send({ error: "Category is Required" });
    case !quantity:
      return res.status(500).send({ error: "Quantity is Required" });
   
  }
    let product = await productModel.findById(req.params.pid);

    // Delete image from cloudinary
    await cloudinary.uploader.destroy(product.cloudinary_id);
    let result
    if(req.file){
    
      // Upload image to cloudinary
       result = await cloudinary.uploader.upload(req.file.path);
    }
 
    const data = {
          ...req.body,
              slug: slugify(req.body.name),
            
             photo: (result ? result.secure_url : product.photo ),
             cloudinary_id:(result ? result.public_id : product.cloudinary_id),
           
    };
    product = await productModel.findByIdAndUpdate(req.params.pid, data, {
 new: true
 });
 res.status(201).send({
  success: true,
  message: "Product Updated Successfully",
  product,
});
} catch (error) {
console.log(error);
res.status(500).send({
  success: false,
  error,
  message: "Error in Updte product",
});
}
};

// filters
export const productFiltersController = async (req, res) => {
  try {


    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
       res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
