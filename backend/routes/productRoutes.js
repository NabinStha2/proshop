const express = require("express");
const router = express.Router();
const {
  getProductById,
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
  getTopProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/top").get(getTopProduct);
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .patch(protect, admin, updateProduct);
router.route("/:id/reviews").post(protect, createProductReview);

module.exports = router;
