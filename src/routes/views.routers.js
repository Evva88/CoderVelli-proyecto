import express from "express";
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/cartManager.js";

const router = express.Router();
const PM = new ProductManager();
const CM = new CartManager()

const checkSession = (req, res, next) => {
  console.log(
    "Verificando req.session.user en checkSession:",
    req.session.user
  );
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

const checkAlreadyLoggedIn = (req, res, next) => {
  console.log("Verificando req.session en checkAlreadyLoggedIn:", req.session);
  console.log(
    "Verificando req.session.user en checkAlreadyLoggedIn:",
    req.session.user
  );
  if (req.session && req.session.user) {
    console.log("Usuario ya autenticado, redirigiendo a /profile");
    res.redirect("/profile");
  } else {
    console.log("Usuario no autenticado, procediendo...");
    next();
  }
};


router.get("/", async (req, res) => {
  const products = await PM.getProducts(req.query);
  res.render("login");
});


router.get("/products", async (req, res) => {
  const products = await PM.getProducts(req.query);
  const user = req.session.user;
  res.render("products", {products, user});
});


router.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await PM.getProductById(pid);

  res.render("productDetail", { product });

});


router.get("/cart", async (req, res) => {
  const cid = req.params.cid;
  const cart = await CM.getCart(cid);

  res.render("cart", { products: cart.products });
 
});


router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});


router.get("/chat", (req, res) => {
  res.render("chat");
});


router.get("/login",checkAlreadyLoggedIn, async (req, res) => {
  res.render("login");
});


router.get("/register",checkAlreadyLoggedIn, async (req, res) => {
  res.render("register");
});


router.get("/profile",checkSession, (req, res) => {
  const userData = req.session.user;
  res.render("profile", {user:userData});
});


router.get("/restore", checkSession, (req, res) => {
  res.render("restore");
});



export default router;
