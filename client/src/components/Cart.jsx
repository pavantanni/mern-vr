import { useEffect, useState } from "react";
import API from "../api/axios";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Total calculation (Fixed to use .items)
  const getTotal = () => {
    if (!cart || !cart.items) return 0; // Changed .item to .items

    return cart.items.reduce((total, item) => {
      // Safety check: ensure productId exists before accessing price
      const price = item.productId ? item.productId.price : 0;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>

      {loading ? (
        <p>Loading...</p>
      ) : !cart || !cart.items || cart.items.length === 0 ? ( // Changed .item to .items
        <p>No items in cart</p>
      ) : (
        <>
          {cart.items.map(
            (
              item, // Changed .item to .items
            ) => (
              <div key={item._id} className="card p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  {item.productId ? ( // Safety check for deleted products
                    <>
                      <div>
                        <h5>{item.productId.name}</h5>
                        <p>₹{item.productId.price}</p>
                        <p>Qty: {item.quantity}</p>
                      </div>

                      <img
                        src={item.productId.image || "https://placeholder.com"}
                        alt={item.productId.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    </>
                  ) : (
                    <p>Product information unavailable</p>
                  )}
                </div>
              </div>
            ),
          )}

          <div className="card p-3">
            <h4>Total: ₹{getTotal()}</h4>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
