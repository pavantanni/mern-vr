const express = require("express");
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add", protect, async (req, res) => {
  try {
    const { productId } = req.body;
    // 1. Find the cart for the logged-in user
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      // 2. Create new cart if it doesn't exist (using 'items' plural)
      cart = await Cart.create({
        userId: req.user.id,
        items: [{ productId, quantity: 1 }],
      });
      console.log("New cart created:", cart);
    } else {
      // 3. Check if product already exists in the items array
      const itemIndex = cart.items.findIndex(
        (item) => item.productId && item.productId.toString() === productId,
      );

      if (itemIndex > -1) {
        // 4. Increment quantity if found
        cart.items[itemIndex].quantity += 1;
      } else {
        // 5. Add as new item if not found
        cart.items.push({ productId, quantity: 1 });
      }

      // 6. Save the changes to the existing cart
      await cart.save();
      console.log("Existing cart updated:", cart);
    }

    return res.status(201).json({ message: "Added to cart", cart });
  } catch (err) {
    console.error("Cart Add Error:", err);
    return res.status(500).json({ message: `Error from cart: ${err.message}` });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    // 7. Get cart and populate product details
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId",
    );

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    console.log("Fetched Cart:", cart);
    return res.status(200).json(cart);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Error fetching cart: ${err.message}` });
  }
});

module.exports = router;
