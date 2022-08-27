const product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const asyncErrors = require("../middleware/AsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

//Get all products
exports.getAllProducts = asyncErrors(async (req, res) => {
  const NoOfProductsPerPage = 3;
  const productCount = await product.countDocuments();
  const apiFeature = new ApiFeatures(product.find(), req.query)
    .search()
    .filter()
    .pagination(NoOfProductsPerPage);

  const Products = await apiFeature.query;
  res.status(200).json({
    allProducts: Products,
    productCount,
  });
});

//get single product
exports.getSingleProduct = asyncErrors(async (req, res, next) => {
  let Product = await product.findById(req.params.id);

  if (!Product) {
    return next(new ErrorHandler(404, "Product not found!"));
  }

  res.status(200).json({ Product });
});

//create new product --Admin route
exports.createProduct = asyncErrors(async (req, res) => {
  const Product = await product.create(req.body);

  res.status(201).json({ success: true, Product });
});

//update product --Admin route
exports.updateProduct = asyncErrors(async (req, res) => {
  let Product = await product.findById(req.params.id);

  if (!Product) {
    return next(new ErrorHandler(404, "Product not found!"));
  }

  Product = await product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, Product });
});

//delete product
exports.deleteProduct = asyncErrors(async (req, res) => {
  let Product = await product.findById(req.params.id);

  if (!Product) {
    return next(new ErrorHandler(404, "Product not found!"));
  }

  Product = await product.deleteOne({ _id: req.params.id });

  res
    .status(201)
    .json({ success: true, message: "product deleted successfully!" });
});
