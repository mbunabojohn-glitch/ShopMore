const addToCart = async (req, res) => {
  try {
    const productId = req.body?.productId;
    const quantity = req.body?.quantity;

    console.log("productId:", productId, "quantity:", quantity);

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "productId and quantity are required" });
    }

    const user = req.user;
    console.log(user, "user in the database");

    const existingItem = user.cartItems.find(
      (item) => item.productId.toString() === productId,
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cartItems.push({ productId, quantity });
    }

    await user.save();
    res.status(200).json({
      message: "product added to cartItems successfully",
      cartItems: user.cartItems,
    });
  } catch (error) {
    console.log("error adding product to cart controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export { addToCart };
