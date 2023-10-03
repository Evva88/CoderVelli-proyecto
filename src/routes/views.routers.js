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
  if (product){
  res.render("productDetail", { product });
  } else {
    res.status(404).send({status:"error", message:"Producto no encontrado"})
  }
});


router.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;
  const cart = await CM.getCart(cid);

  if (cart) {
    console.log(JSON.stringify(cart, null, 4));
    res.render("cart", { products: cart.products });
  } else {
    res.status(400).send({
      status: "error",
      message: "Error! No se encuentra el ID de Carrito!",
    });
  }
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

router.get("/faillogin", (req, res) =>{
  res.status(401).json({
      status:"error",
      message: "Error en el ingreso al sitio con ese mail y contraseña"
  });

})


export default router;
