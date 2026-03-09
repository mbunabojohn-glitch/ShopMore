import Product from "../model/product.js";

const createProduct = async (req, res) => {
  try {
    const {
      productTitle,
      brand,
      price,
      salesPrice,
      description,
      stock,
      image,
    } = req.body;

    //Basic Validations
    if (
      !productTitle ||
      !brand ||
      !price ||
      !salesPrice ||
      !description ||
      !stock ||
      !image
    ) {
      return res.status(404).json({ message: "All fields are required" });
    }

    //Create a new Product Object
    const newProduct = new Product({
      productTitle,
      brand,
      price,
      salesPrice,
      description,
      stock,
      image,
    });

    // Save the product to database
    const savedProduct = await newProduct.save();
    res
      .status(201)
      .json({ message: "Product Created Successfully", product: savedProduct });
  } catch (error) {
    console.error("Error saving product:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch few Products
const fetchFewProductItems = async (req, res) => {
  try {
    const products = await Product.find({
      productTitle: "iphone 13",
      brand: "Apple",
      price: 400000,
    });
    res.status(200).json({
      success: true,
      message: "selected product found",
      product: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `error occured fetching selected product, ${error.message}`,
    });
  }
};

// Fetch one product
const fetchOneProduct = async (req, res) => {
  try {
    const productOne = req.params._id;
    const oneProduct = await Product.findById(productOne);
    if (!oneProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
        oneProduct,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        oneProduct,
      });
    }
  } catch (error) {
    console.log("server error", error.message);
    res
      .status(500)
      .json({ message: "error in the server", error: error.message });
  }
};

// fetch expensive products only
const fetchExpensiveProduct = async (req, res) => {
  try {
    const expensiveProduct = await Product.findById({
      price: { $gt: 460000 },
    });
    res.status(200).json({
      success: true,
      message: "product fetched successful",
      expensiveProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "server crashed", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleteItem = req.params._id;
    const deleteMyProduct = await Product.findByIdAndDelete(deleteItem);
    if (!deleteMyProduct) {
      res.status(404).json({ message: "product not found", deleteMyProduct });
    } else {
      res
        .status(200)
        .json({ message: `Product deleted successfully, ${error.message}` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "error coming from server", error: error.message });
  }
};
export {
  createProduct,
  getAllProducts,
  fetchFewProductItems,
  fetchOneProduct,
  fetchExpensiveProduct,
  deleteProduct,
};
