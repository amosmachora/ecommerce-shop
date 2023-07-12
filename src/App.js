import React, { useState, useEffect } from "react";
import { CssBaseline } from "@material-ui/core";

import { Navbar, Products, Cart, Checkout } from "./components";
import { commerce } from "./lib/commerce";
import { Outlet } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [products, setProducts] = useState([]); //Confirmed
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  //fetch products from commerce
  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    setProducts(data);
  };

  //fetch cart from commerce
  const fetchCart = async () => {
    // setCart(commerce.cart.contents().then((items) => console.log(items)));
    // console.log(cart);
    // commerce.cart.contents().then((items) => console.log(items))
    setCart(await commerce.cart.retrieve());
  };

  const handleAddToCart = async (productId, quantity) => {
    // commerce.cart .add("prod_G6kVw7KOKdw2eD", 5)  .then((response) => console.log(response));
    const item = await commerce.cart.add(productId, quantity);
    // console.log(item);

    setCart(item.cart);
  };

  const handleUpdateCartQty = async (lineItemId, quantity) => {
    const response = await commerce.cart.update(lineItemId, { quantity });

    setCart(response.cart);
  };

  const handleRemoveFromCart = async (lineItemId) => {
    const response = await commerce.cart.remove(lineItemId);
    setCart(response.cart);
  };

  const handleEmptyCart = async () => {
    const response = await commerce.cart.empty();
    setCart(response.cart);
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();
    setCart(newCart);
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(
        checkoutTokenId,
        newOrder
      );

      setOrder(incomingOrder);
      refreshCart();
    } catch (error) {
      setErrorMessage(error.data.error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <div style={{ display: "flex" }}>
      <BrowserRouter>
        <CssBaseline />
        <Navbar
          totalItems={cart.total_items}
          handleDrawerToggle={handleDrawerToggle}
        />

        <Routes>
          <Route
            path="/home"
            element={
              <Products
                products={products}
                onAddToCart={handleAddToCart}
                handleUpdateCartQty
              />
            }
          >
            <Route
              path="/home/cart"
              element={
                <Cart
                  cart={cart}
                  onUpdateCartQty={handleUpdateCartQty}
                  onRemoveFromCart={handleRemoveFromCart}
                  onEmptyCart={handleEmptyCart}
                />
              }
            />
          </Route>
          {/* <Route
            path="/checkout"
            element={
              <Checkout
                cart={cart}
                order={order}
                onCaptureCheckout={handleCaptureCheckout}
                error={errorMessage}
              />
            }
          ></Route> */}
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>

      <Outlet />
    </div>
  );
};

export default App;
