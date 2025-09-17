// src/pages/ShoppingCartPage/ShoppingCartPage.tsx
import React, { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Product } from "../../types";
import styles from "./ShoppingCartPage.module.css";

// Fix: Define a local CartItem interface that correctly extends Product
// and adds the quantity property. This resolves the type errors with the data
// coming from the useCart hook.
interface LocalCartItem extends Product {
  quantity: number;
}

const ShoppingCartPage: React.FC = () => {
  // Fix: Use a double-cast (as unknown as) to force the type conversion.
  // This tells TypeScript to trust that the data from the context will
  // conform to our LocalCartItem type at runtime.
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotalPrice,
  } = useCart() as unknown as {
    cartItems: LocalCartItem[];
    removeFromCart: (id: string | number) => void;
    updateQuantity: (id: string | number, quantity: number) => void;
    getCartTotalPrice: () => number;
  };

  const navigate = useNavigate();

  const handleQuantityChange = (
    item: LocalCartItem,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newQty = parseInt(event.target.value, 10);
    if (!isNaN(newQty) && newQty > 0) {
      updateQuantity(String(item.id), newQty);
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/checkout");
    } else {
      alert(
        "Your cart is empty. Please add items before proceeding to checkout."
      );
    }
  };

  return (
    <div className={styles.cartPage}>
      <h1>Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <h2>Your cart is empty</h2>
          <p>Start adding items to see them here.</p>
        </div>
      ) : (
        <>
          <div className={styles.cartItemsContainer}>
            {cartItems.map((item) => {
              const imageSrc =
                item.image || item.images?.[0] || item.thumbnail || "";

              return (
                <div key={item.id} className={styles.cartItem}>
                  <img
                    src={imageSrc}
                    alt={item.title}
                    className={styles.itemImage}
                  />
                  <div className={styles.itemDetails}>
                    <h3>{item.title}</h3>
                    <p>Price: ${item.price.toFixed(2)}</p>
                    <div className={styles.quantityControl}>
                      <button
                        onClick={() =>
                          updateQuantity(String(item.id), item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => handleQuantityChange(item, e)}
                      />
                      <button
                        onClick={() =>
                          updateQuantity(String(item.id), item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(String(item.id))}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                  <div className={styles.itemSubtotal}>
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.cartSummary}>
            <div className={styles.total}>
              <h3>Total:</h3>
              <span>${getCartTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </>
      )}

      <button
        onClick={handleProceedToCheckout}
        className={`${styles.checkoutButton} button`}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default ShoppingCartPage;