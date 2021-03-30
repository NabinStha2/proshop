const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

module.exports.getProducts = asyncHandler(async (req, res) => {
  const perPage = 5; // 5 item in each page
  const page = Number(req.query.pageNumber) || 1; // current page number

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i", // i means caseSensitive
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(perPage)
    .skip(perPage * (page - 1)); // by how many item do we skip to show the item in the screen
  res.json({ products, page, pages: Math.ceil(count / perPage) });
});

module.exports.getProductById = asyncHandler(async (req, res) => {
  //   const product = products.find((p) => p._id === req.params.id);
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//delete api/products/:id
module.exports.deleteProduct = asyncHandler(async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(404);
    throw new Error("Product not found");
  }
});

//post api/products
module.exports.createProduct = asyncHandler(async (req, res) => {
  // try {
  //   const createdProduct = await Product.create({
  //     name: req.body.name,
  //     price: req.body.price,
  //     user: req.user._id,
  //     image: req.body.image,
  //     brand: req.body.brand,
  //     category: req.body.category,
  //     countInStock: req.body.countInStock,
  //     numReviews: 0,
  //     description: req.body.description,
  //   });
  //   res.status(201).json(createdProduct);
  // } catch (error) {
  //   res.status(404);
  //   throw new Error("Product not found");
  // }
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/home.jpeg",
    brand: "sample brand",
    category: "sample category",
    countInStock: 0,
    numReviews: 0,
    description: "sample description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//patch api/products/:id
module.exports.updateProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      brand,
      category,
      image,
      countInStock,
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      name,
      price,
      description,
      brand,
      category,
      image,
      countInStock,
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(404);
    throw new Error("Product not found");
  }
});

//post api/products/:id/reviews
module.exports.createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed by " + req.user.name);
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//post api/products/top
module.exports.getTopProduct = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ rating: -1 }).limit(3);
  res.json(products);
});
